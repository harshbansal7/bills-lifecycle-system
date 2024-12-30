from flask import Blueprint, request, jsonify
from services.bill_service import BillService
from models.bill import BillStatus
from bson import ObjectId, json_util
import json

bill_bp = Blueprint('bills', __name__)
bill_service = None

@bill_bp.record
def record_params(setup_state):
    global bill_service
    app = setup_state.app
    bill_service = BillService(app.db)

@bill_bp.route('/bills', methods=['POST'])
def create_bill():
    data = request.get_json()
    required_fields = ['bill_number', 'receipt_date', 'employee_id', 'employee_name', 
                      'dependent_name', 'relationship', 'treatment_period_from', 
                      'treatment_period_to', 'amount_claimed', 'hospital']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    try:
        bill_id = bill_service.create_bill(data)
        return jsonify({"message": "Bill created successfully", "id": bill_id}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bill_bp.route('/bills', methods=['GET'])
def get_bills():
    try:
        bills = bill_service.get_all_bills()
        return json.loads(json_util.dumps(bills)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bill_bp.route('/bills/<bill_id>', methods=['GET'])
def get_bill(bill_id):
    try:
        bill = bill_service.get_bill_by_id(bill_id)
        if not bill:
            return jsonify({"error": "Bill not found"}), 404
        return json.loads(json_util.dumps(bill)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bill_bp.route('/bills/<bill_id>', methods=['PUT'])
def update_bill(bill_id):
    data = request.get_json()
    try:
        success = bill_service.update_bill(bill_id, data)
        if not success:
            return jsonify({"error": "Bill not found"}), 404
        return jsonify({"message": "Bill updated successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bill_bp.route('/bills/<bill_id>', methods=['DELETE'])
def delete_bill(bill_id):
    try:
        success = bill_service.delete_bill(bill_id)
        if not success:
            return jsonify({"error": "Bill not found"}), 404
        return jsonify({"message": "Bill deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bill_bp.route('/employees/<employee_id>/bills', methods=['GET'])
def get_employee_bills(employee_id):
    try:
        bills = bill_service.get_bills_by_employee(employee_id)
        return json.loads(json_util.dumps(bills)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bill_bp.route('/bills/<bill_id>/status', methods=['PUT'])
def update_bill_status(bill_id):
    data = request.get_json()
    
    if 'status' not in data:
        return jsonify({"error": "Status is required"}), 400
        
    try:
        success = bill_service.update_bill_status(bill_id, data)
        if not success:
            return jsonify({"error": "Bill not found"}), 404
        return jsonify({"message": "Bill status updated successfully"}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bill_bp.route('/bills/status/<status>', methods=['GET'])
def get_bills_by_status(status):
    try:
        if status not in [s.value for s in BillStatus]:
            return jsonify({"error": "Invalid status"}), 400
            
        bills = bill_service.get_bills_by_status(status)
        return json.loads(json_util.dumps(bills)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@bill_bp.route('/bills/filter', methods=['POST'])
def filter_bills():
    filter_data = request.get_json()
    try:
        bills = bill_service.filter_bills(filter_data)
        return json.loads(json_util.dumps(bills)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500 