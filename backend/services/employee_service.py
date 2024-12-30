from models.employee import Employee
from datetime import datetime

class EmployeeService:
    def __init__(self, db):
        self.db = db

    def create_employee(self, employee_data):
        # Check if employee_id already exists
        employee_id = employee_data.get('employee_id')
        if self.db.employees.find_one({"employee_id": employee_id}):
            raise ValueError("Employee ID already exists")

        employee_id = employee_data.get('employee_id')
        name = employee_data.get('name')
        father_name = employee_data.get('father_name')
        designation = employee_data.get('designation')
        status = employee_data.get('status')
        sub_division = employee_data.get('sub_division')
        phone = employee_data.get('phone')
        dependents = employee_data.get('dependents')

        # Ensure status is a string
        status = str(status) if status else "WORKING"

        # Create employee with all fields
        employee = Employee(
            employee_id=employee_id,
            name=name,
            father_name=father_name,
            designation=designation,
            status=status,
            sub_division=sub_division,
            phone=phone,
            dependents=dependents
        )
        
        result = self.db.employees.insert_one(employee.to_dict())
        return str(result.inserted_id)

    def get_all_employees(self):
        return list(self.db.employees.find().sort("name", 1))

    def get_employee_by_id(self, employee_id):
        employee = self.db.employees.find_one({"employee_id": employee_id})
        if employee:
            # Convert datetime objects to strings if they exist
            if isinstance(employee.get('created_at'), datetime):
                employee['created_at'] = employee['created_at'].isoformat()
            if isinstance(employee.get('updated_at'), datetime):
                employee['updated_at'] = employee['updated_at'].isoformat()
        return employee

    def search_employees(self, name):
        return list(self.db.employees.find({
            "name": {"$regex": name, "$options": "i"}
        }).sort("name", 1))

    def update_employee(self, employee_id, update_data):
        # Remove _id from update data if it exists
        if '_id' in update_data:
            del update_data['_id']
        
        update_data["updated_at"] = datetime.now()
        result = self.db.employees.update_one(
            {"employee_id": employee_id},
            {"$set": update_data}
        )
        return result.modified_count > 0

    def delete_employee(self, employee_id):
        """Delete an employee and their data"""
        result = self.db.employees.delete_one({"employee_id": employee_id})
        return result.deleted_count > 0