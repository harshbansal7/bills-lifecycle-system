from datetime import datetime
from enum import Enum

class EmployeeStatus(str, Enum):
    WORKING = "WORKING"
    RETIRED = "RETIRED"

class LifeStatus(str, Enum):
    ALIVE = "ALIVE"
    DECEASED = "DECEASED"

class SubDivision(str, Enum):
    SEWERAGE_1 = "Sewarage Sub Division No 1"
    WS_2 = "W/S Sub Division No 2"
    WS_6 = "W/S Sub Division No 6"
    PH_3 = "PH Division Number 3"
    OTHER = "Other"

class Employee:
    def __init__(self, employee_id, name, father_name=None, designation=None, status="WORKING", 
                 sub_division=None, phone=None, bank_account=None, bank_name=None, bank_branch=None,
                 retirement_date=None, life_status="ALIVE", death_date=None, dependents=None):
        self.employee_id = employee_id
        self.name = name
        self.father_name = father_name
        self.designation = designation
        self.status = str(status)
        # Validate sub_division against enum values
        # if sub_division and sub_division not in SubDivision._value2member_map_:
        #     raise ValueError(f"Invalid sub_division value. Must be one of: {', '.join(SubDivision._value2member_map_.keys())}")

        self.sub_division = sub_division
        self.phone = phone
        self.bank_account = bank_account
        self.bank_name = bank_name
        self.bank_branch = bank_branch
        self.retirement_date = retirement_date
        self.life_status = str(life_status)
        self.death_date = death_date
        # Add employee themselves as first dependent
        self.dependents = [{"name": name, "relation": "Self"}]
        # Add other dependents if provided
        if dependents:
            self.dependents.extend(dependents)
        self.created_at = datetime.utcnow()
        self.updated_at = datetime.utcnow()

    def to_dict(self):
        return {
            "employee_id": self.employee_id,
            "name": self.name,
            "father_name": self.father_name,
            "designation": self.designation,
            "status": self.status,
            "sub_division": self.sub_division,
            "phone": self.phone,
            "bank_account": self.bank_account,
            "bank_name": self.bank_name,
            "bank_branch": self.bank_branch,
            "retirement_date": self.retirement_date,
            "life_status": self.life_status,
            "death_date": self.death_date,
            "dependents": self.dependents,
            "created_at": self.created_at,
            "updated_at": self.updated_at
        } 