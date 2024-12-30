from datetime import datetime
from enum import Enum

class BillStatus(str, Enum):
    RECEIVED = "Received From Subdivision"
    SENT_TO_MS = "Sent to Medical Superintendent"
    RECEIVED_FROM_MS = "Received back from Medical Superintendent"
    SENT_TO_CO = "Sent to Circle Office"
    RECEIVED_FROM_CO = "Received back from Circle Office"
    OFFICE_ORDER = "Office Order"
    VOUCHER_CREATION = "Voucher Creation"
    VOUCHER_PASSED = "Passing of Voucher"
    SENT_BACK = "Sent Back to Subdivision"
    REJECTED = "Rejected"

class StatusUpdate:
    def __init__(self, status, date, remarks=None, reference_number=None, approved_amount=None):
        self.status = status
        self.date = datetime.fromisoformat(date.replace('Z', '')) if isinstance(date, str) else date
        self.remarks = remarks
        self.reference_number = reference_number
        self.approved_amount = approved_amount

    def to_dict(self):
        return {
            "status": self.status,
            "date": self.date.isoformat() if self.date else None,
            "remarks": self.remarks,
            "reference_number": self.reference_number,
            "approved_amount": self.approved_amount
        }

class Bill:
    def __init__(self, bill_number, receipt_date, employee_id, employee_name, dependent_name, 
                 relationship, treatment_period_from, treatment_period_to, amount_claimed, hospital, sub_division="Unknown"):
        self.bill_number = bill_number
        self.receipt_date = datetime.fromisoformat(receipt_date.replace('Z', '')) if isinstance(receipt_date, str) else receipt_date
        self.employee_id = employee_id
        self.employee_name = employee_name
        self.dependent_name = dependent_name
        self.relationship = relationship
        self.treatment_period_from = datetime.fromisoformat(treatment_period_from.replace('Z', '')) if isinstance(treatment_period_from, str) else treatment_period_from
        self.treatment_period_to = datetime.fromisoformat(treatment_period_to.replace('Z', '')) if isinstance(treatment_period_to, str) else treatment_period_to
        self.amount_claimed = float(amount_claimed)
        self.hospital = hospital
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()
        self.current_status = f"Received From {sub_division}"
        self.status_history = [
            StatusUpdate(
                self.current_status,
                datetime.utcnow(),
                "Bill received from subdivision"
            ).to_dict()
        ]

    def to_dict(self):
        return {
            "bill_number": self.bill_number,
            "receipt_date": self.receipt_date.isoformat(),
            "employee_id": self.employee_id,
            "employee_name": self.employee_name,
            "dependent_name": self.dependent_name,
            "relationship": self.relationship,
            "treatment_period_from": self.treatment_period_from.isoformat(),
            "treatment_period_to": self.treatment_period_to.isoformat(),
            "amount_claimed": self.amount_claimed,
            "hospital": self.hospital,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "current_status": self.current_status,
            "status_history": self.status_history
        } 