export const STATUS_CONFIG = {
  "Received From Subdivision": {
    fields: [{
      name: "reference_number",
      label: "Reference Number",
      required: true,
      type: "text"
    }],
    isInitialStatus: true
  },
  "Sent to Medical Superintendent": {
    fields: [{
      name: "reference_number",
      label: "Letter No.",
      required: true,
      type: "text"
    }, {
      name: "approved_amount",
      label: "Recommended Amount",
      required: true,
      type: "currency"
    }]
  },

  "Received back from Medical Superintendent": {
    fields: [{
      name: "reference_number",
      label: "Letter No.",
      required: true,
      type: "text"
    }, {
      name: "approved_amount",
      label: "Approved Amount",
      required: true,
      type: "currency"
    }]
  },

  "Sent to Circle Office": {
    fields: [{
      name: "reference_number",
      label: "Letter No.",
      required: true,
      type: "text"
    }]
  },

  "Received back from Circle Office": {
    fields: [{
      name: "reference_number",
      label: "Letter No.",
      required: true,
      type: "text"
    }]
  },

  "Office Order": {
    fields: [{
      name: "reference_number",
      label: "Office Order Number",
      required: true,
      type: "text"
    }, {
      name: "approved_amount",
      label: "Sanctioned Amount",
      required: true,
      type: "currency"
    }]
  },

  "Passing of Voucher": {
    fields: [{
      name: "reference_number",
      label: "Voucher Number",
      required: true,
      type: "text"
    }]
  },

  "Sent Back to Subdivision": {
    fields: [{
      name: "reference_number",
      label: "Letter No.",
      required: false,
      type: "text"
    }]
  },
  
  "Rejected": {
    fields: [{
      name: "reference_number",
      label: "Reference Number",
      required: false,
      type: "text"
    }]
  }
}; 