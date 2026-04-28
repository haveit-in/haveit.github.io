import { Link, useNavigate } from "react-router";
import { Store, Check, AlertCircle } from "lucide-react";
import { useState } from "react";

const steps = [
  { id: 1, name: "Basic Details" },
  { id: 2, name: "Restaurant Info" },
  { id: 3, name: "Uploads" },
  { id: 4, name: "Bank Details" },
  { id: 5, name: "Review & Submit" },
];

export function RegistrationPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    cuisine: [],
    fssai: "",
    accountNumber: "",
    ifsc: "",
    accountHolder: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[+]?[\d\s-()]{10,}$/;
    return phoneRegex.test(phone);
  };

  const validateIFSC = (ifsc) => {
    const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    return ifscRegex.test(ifsc.toUpperCase());
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.restaurantName.trim()) {
        newErrors.restaurantName = "Restaurant name is required";
      }
      if (!formData.ownerName.trim()) {
        newErrors.ownerName = "Owner name is required";
      }
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!validateEmail(formData.email)) {
        newErrors.email = "Please enter a valid email address";
      }
      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required";
      } else if (!validatePhone(formData.phone)) {
        newErrors.phone = "Please enter a valid phone number";
      }
    }

    if (step === 2) {
      if (!formData.address.trim()) {
        newErrors.address = "Address is required";
      }
      if (!formData.city.trim()) {
        newErrors.city = "City is required";
      }
      if (formData.cuisine.length === 0) {
        newErrors.cuisine = "Please select at least one cuisine type";
      }
      if (!formData.fssai.trim()) {
        newErrors.fssai = "FSSAI license number is required";
      }
    }

    if (step === 4) {
      if (!formData.accountNumber.trim()) {
        newErrors.accountNumber = "Account number is required";
      }
      if (!formData.ifsc.trim()) {
        newErrors.ifsc = "IFSC code is required";
      } else if (!validateIFSC(formData.ifsc)) {
        newErrors.ifsc = "Please enter a valid IFSC code";
      }
      if (!formData.accountHolder.trim()) {
        newErrors.accountHolder = "Account holder name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
      } else {
        navigate("/pending");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white p-4">
      <div className="max-w-3xl mx-auto py-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Store className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-semibold">HaveIt Partner</span>
          </Link>
          <h1 className="text-3xl font-bold mb-2">Register Your Restaurant</h1>
          <p className="text-gray-600">Complete the steps below to get started</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                      currentStep > step.id
                        ? "bg-orange-600 border-orange-600 text-white"
                        : currentStep === step.id
                        ? "border-orange-600 text-orange-600 bg-white"
                        : "border-gray-300 text-gray-400 bg-white"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                  </div>
                  <p
                    className={`text-xs mt-2 text-center ${
                      currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {step.name}
                  </p>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-0.5 flex-1 -mt-6 ${
                      currentStep > step.id ? "bg-orange-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
                <input
                  type="text"
                  value={formData.restaurantName}
                  onChange={(e) => {
                    setFormData({ ...formData, restaurantName: e.target.value });
                    if (errors.restaurantName) {
                      setErrors({ ...errors, restaurantName: "" });
                    }
                  }}
                  placeholder="Enter restaurant name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.restaurantName ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.restaurantName && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.restaurantName}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Owner Name</label>
                <input
                  type="text"
                  value={formData.ownerName}
                  onChange={(e) => {
                    setFormData({ ...formData, ownerName: e.target.value });
                    if (errors.ownerName) {
                      setErrors({ ...errors, ownerName: "" });
                    }
                  }}
                  placeholder="Enter owner name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.ownerName ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.ownerName && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.ownerName}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => {
                    setFormData({ ...formData, email: e.target.value });
                    if (errors.email) {
                      setErrors({ ...errors, email: "" });
                    }
                  }}
                  placeholder="restaurant@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.email ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    setFormData({ ...formData, phone: e.target.value });
                    if (errors.phone) {
                      setErrors({ ...errors, phone: "" });
                    }
                  }}
                  placeholder="+91 98765 43210"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.phone ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.phone && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.phone}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Restaurant Information</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => {
                    setFormData({ ...formData, address: e.target.value });
                    if (errors.address) {
                      setErrors({ ...errors, address: "" });
                    }
                  }}
                  placeholder="Enter complete address"
                  rows={3}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.address ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.address && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.address}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => {
                    setFormData({ ...formData, city: e.target.value });
                    if (errors.city) {
                      setErrors({ ...errors, city: "" });
                    }
                  }}
                  placeholder="Enter city"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.city ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.city && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.city}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cuisine Types</label>
                <div className={`grid grid-cols-2 gap-3 ${errors.cuisine ? "border border-red-500 rounded-lg p-2" : ""}`}>
                  {["North Indian", "South Indian", "Chinese", "Continental", "Italian", "Fast Food"].map((cuisine) => (
                    <label key={cuisine} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg hover:border-orange-500 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.cuisine.includes(cuisine)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setFormData({ ...formData, cuisine: [...formData.cuisine, cuisine] });
                          } else {
                            setFormData({ ...formData, cuisine: formData.cuisine.filter((c) => c !== cuisine) });
                          }
                          if (errors.cuisine) {
                            setErrors({ ...errors, cuisine: "" });
                          }
                        }}
                        className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                      />
                      <span className="text-sm">{cuisine}</span>
                    </label>
                  ))}
                </div>
                {errors.cuisine && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.cuisine}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">FSSAI License Number</label>
                <input
                  type="text"
                  value={formData.fssai}
                  onChange={(e) => {
                    setFormData({ ...formData, fssai: e.target.value });
                    if (errors.fssai) {
                      setErrors({ ...errors, fssai: "" });
                    }
                  }}
                  placeholder="Enter FSSAI license number"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.fssai ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.fssai && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.fssai}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Upload Documents</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Images</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 cursor-pointer">
                  <p className="text-gray-600">Click to upload or drag and drop</p>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG up to 10MB (Max 5 images)</p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Menu Upload</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 cursor-pointer">
                  <p className="text-gray-600">Click to upload menu</p>
                  <p className="text-sm text-gray-500 mt-1">PDF, PNG, JPG up to 10MB</p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => {
                    setFormData({ ...formData, accountNumber: e.target.value });
                    if (errors.accountNumber) {
                      setErrors({ ...errors, accountNumber: "" });
                    }
                  }}
                  placeholder="Enter account number"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.accountNumber ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.accountNumber && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.accountNumber}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code</label>
                <input
                  type="text"
                  value={formData.ifsc}
                  onChange={(e) => {
                    setFormData({ ...formData, ifsc: e.target.value });
                    if (errors.ifsc) {
                      setErrors({ ...errors, ifsc: "" });
                    }
                  }}
                  placeholder="Enter IFSC code (e.g., SBIN0001234)"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.ifsc ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.ifsc && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.ifsc}</span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name</label>
                <input
                  type="text"
                  value={formData.accountHolder}
                  onChange={(e) => {
                    setFormData({ ...formData, accountHolder: e.target.value });
                    if (errors.accountHolder) {
                      setErrors({ ...errors, accountHolder: "" });
                    }
                  }}
                  placeholder="Enter account holder name"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent ${
                    errors.accountHolder ? "border-red-500" : "border-gray-200"
                  }`}
                />
                {errors.accountHolder && (
                  <div className="flex items-center gap-1 mt-1 text-red-500 text-sm">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.accountHolder}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Restaurant Name</p>
                  <p className="font-medium">{formData.restaurantName || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Owner Name</p>
                  <p className="font-medium">{formData.ownerName || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium">{formData.email || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{formData.phone || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Address</p>
                  <p className="font-medium">{formData.address || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">City</p>
                  <p className="font-medium">{formData.city || "Not provided"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cuisine Types</p>
                  <p className="font-medium">{formData.cuisine.join(", ") || "Not selected"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">FSSAI License</p>
                  <p className="font-medium">{formData.fssai || "Not provided"}</p>
                </div>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <p className="text-sm text-orange-800">
                  By submitting, you agree to our terms and conditions. Your application will be reviewed within 24-48 hours.
                </p>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 ? (
              <button
                onClick={handleBack}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back
              </button>
            ) : (
              <Link to="/" className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                Cancel
              </Link>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:shadow-lg transition-all"
            >
              {currentStep === 5 ? "Submit Application" : "Continue"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
