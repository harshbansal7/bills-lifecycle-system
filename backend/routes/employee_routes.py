from flask import Blueprint, request, jsonify
from services.employee_service import EmployeeService
from bson import ObjectId

employee_bp = Blueprint('employees', __name__)
employee_service = None

@employee_bp.record
def record_params(setup_state):
    global employee_service
    app = setup_state.app
    employee_service = EmployeeService(app.db)

def serialize_employee(employee):
    """Helper function to serialize employee document"""
    if employee:
        employee['_id'] = str(employee['_id'])  # Convert ObjectId to string
        # Convert datetime objects if they exist
        if 'created_at' in employee and hasattr(employee['created_at'], 'isoformat'):
            employee['created_at'] = employee['created_at'].isoformat()
        if 'updated_at' in employee and hasattr(employee['updated_at'], 'isoformat'):
            employee['updated_at'] = employee['updated_at'].isoformat()
    return employee

@employee_bp.route('/employees', methods=['POST'])
def create_employee():
    data = request.get_json()
    required_fields = ['employee_id', 'name']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        # Print received data for debugging
        print("Received employee data:", data)
        employee_id = employee_service.create_employee(data)
        return jsonify({"message": "Employee created successfully", "id": employee_id}), 201
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        print(f"Error creating employee: {str(e)}")  # Add logging
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/employees', methods=['GET'])
def get_employees():
    name = request.args.get('name', '')
    try:
        if name:
            employees = employee_service.search_employees(name)
        else:
            employees = employee_service.get_all_employees()
        
        # Format response and ensure dependents are included
        formatted_employees = []
        for emp in employees:
            emp['_id'] = str(emp['_id'])
            formatted_employees.append(emp)
            
        return jsonify(formatted_employees), 200
    except Exception as e:
        print(f"Error fetching employees: {str(e)}")  # Add logging
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/employees/<employee_id>', methods=['GET'])
def get_employee(employee_id):
    try:
        employee = employee_service.get_employee_by_id(employee_id)
        if not employee:
            return jsonify({"error": "Employee not found"}), 404
        return jsonify(serialize_employee(employee)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/employees/<employee_id>', methods=['PUT'])
def update_employee(employee_id):
    data = request.get_json()
    try:
        success = employee_service.update_employee(employee_id, data)
        if not success:
            return jsonify({"error": "Employee not found"}), 404
        return jsonify({"message": "Employee updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/employees/<employee_id>/deactivate', methods=['POST'])
def deactivate_employee(employee_id):
    try:
        success = employee_service.deactivate_employee(employee_id)
        if not success:
            return jsonify({"error": "Employee not found"}), 404
        return jsonify({"message": "Employee deactivated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@employee_bp.route('/employees/<employee_id>', methods=['DELETE'])
def delete_employee(employee_id):
    try:
        success = employee_service.delete_employee(employee_id)
        if not success:
            return jsonify({"error": "Employee not found"}), 404
        return jsonify({"message": "Employee deleted successfully"}), 200
    except Exception as e:
        print(f"Error deleting employee: {str(e)}")
        return jsonify({"error": str(e)}), 500 