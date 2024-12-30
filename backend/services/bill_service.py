from datetime import datetime

from flask import jsonify
from models.bill import Bill, BillStatus, StatusUpdate
from bson import ObjectId

class BillService:
    def __init__(self, db):
        self.db = db

    def create_bill(self, bill_data):
        bill_number = bill_data['bill_number']
        if self.db.bills.find_one({"bill_number": bill_number}):
            return jsonify({"error": "Bill number already exists"}), 400
        
        # Get employee details to fetch sub_division
        employee = self.db.employees.find_one({"employee_id": bill_data['employee_id']})
        sub_division = employee.get('sub_division', 'Unknown') if employee else 'Unknown'
        
        bill = Bill(
            bill_number=bill_data['bill_number'],
            receipt_date=bill_data['receipt_date'],
            employee_id=bill_data['employee_id'],
            employee_name=bill_data['employee_name'],
            dependent_name=bill_data['dependent_name'],
            relationship=bill_data['relationship'],
            treatment_period_from=bill_data['treatment_period_from'],
            treatment_period_to=bill_data['treatment_period_to'],
            amount_claimed=bill_data['amount_claimed'],
            hospital=bill_data['hospital'],
            sub_division=sub_division
        )
        
        result = self.db.bills.insert_one(bill.to_dict())
        return str(result.inserted_id)

    def get_all_bills(self):
        return list(self.db.bills.find().sort("created_at", -1))

    def get_bill_by_id(self, bill_id):
        return self.db.bills.find_one({"_id": ObjectId(bill_id)})

    def get_bills_by_employee(self, employee_id):
        return list(self.db.bills.find({"employee_id": employee_id}).sort("created_at", -1))

    def update_bill(self, bill_id, update_data):
        # Remove _id from update data if it exists
        if '_id' in update_data:
            del update_data['_id']
        
        update_data["updated_at"] = datetime.utcnow()
        result = self.db.bills.update_one(
            {"_id": ObjectId(bill_id)},
            {"$set": update_data}
        )
        return result.modified_count > 0

    def delete_bill(self, bill_id):
        result = self.db.bills.delete_one({"_id": ObjectId(bill_id)})
        return result.deleted_count > 0 

    def update_bill_status(self, bill_id, status_data):
        """Update bill status and add to history"""
        try:
            # Validate the new status
            new_status = status_data['status']
            if new_status not in [status.value for status in BillStatus]:
                raise ValueError(f"Invalid status: {new_status}")

            # Use provided date or current date
            status_date = status_data.get('date', datetime.utcnow().isoformat())

            # Create new status update with additional fields
            status_update = StatusUpdate(
                status=new_status,
                date=status_date,
                remarks=status_data.get('remarks'),
                reference_number=status_data.get('reference_number'),
                approved_amount=status_data.get('approved_amount')
            ).to_dict()

            # Update the document
            result = self.db.bills.update_one(
                {"_id": ObjectId(bill_id)},
                {
                    "$set": {
                        "current_status": new_status,
                        "updated_at": datetime.utcnow(),
                        # Store the latest values at bill level for easy querying
                        "latest_reference_number": status_data.get('reference_number'),
                        "latest_approved_amount": status_data.get('approved_amount')
                    },
                    "$push": {
                        "status_history": status_update
                    }
                }
            )
            return result.modified_count > 0
        except Exception as e:
            raise ValueError(f"Failed to update bill status: {str(e)}")

    def get_bills_by_status(self, status):
        """Get all bills with a specific status"""
        return list(self.db.bills.find({"current_status": status}).sort("updated_at", -1))

    def filter_bills(self, filter_data):
        """Filter bills based on multiple criteria"""
        query = {}
        
        # Basic filters
        if filter_data.get('bill_number'):
            query['bill_number'] = {'$regex': filter_data['bill_number'], '$options': 'i'}
        
        if filter_data.get('employee_id'):
            query['employee_id'] = {'$regex': filter_data['employee_id'], '$options': 'i'}
        
        if filter_data.get('employee_name'):
            query['employee_name'] = {'$regex': filter_data['employee_name'], '$options': 'i'}
        
        if filter_data.get('status'):
            query['current_status'] = filter_data['status']
        
        # Reference number search
        if filter_data.get('reference_search'):
            ref_search = filter_data['reference_search']
            if ref_search.get('number'):
                if ref_search.get('status'):
                    # Search for reference number in specific status
                    query['status_history'] = {
                        '$elemMatch': {
                            'status': ref_search['status'],
                            'reference_number': {'$regex': ref_search['number'], '$options': 'i'}
                        }
                    }
                else:
                    # Search for reference number in any status
                    query['status_history.reference_number'] = {
                        '$regex': ref_search['number'],
                        '$options': 'i'
                    }

        # Date range filters
        if filter_data.get('date_from'):
            query['receipt_date'] = {'$gte': filter_data['date_from']}
        if filter_data.get('date_to'):
            if 'receipt_date' in query:
                query['receipt_date']['$lte'] = filter_data['date_to']
            else:
                query['receipt_date'] = {'$lte': filter_data['date_to']}
        
        # Amount range filters
        if filter_data.get('amount_from'):
            query['amount_claimed'] = {'$gte': float(filter_data['amount_from'])}
        if filter_data.get('amount_to'):
            if 'amount_claimed' in query:
                query['amount_claimed']['$lte'] = float(filter_data['amount_to'])
            else:
                query['amount_claimed'] = {'$lte': float(filter_data['amount_to'])}
        
        # Hospital filter
        if filter_data.get('hospital'):
            query['hospital'] = filter_data['hospital']

        return list(self.db.bills.find(query).sort("updated_at", -1))