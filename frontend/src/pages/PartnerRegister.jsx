import { Link, useNavigate } from "react-router";
import { Store, Check, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

  // Clear form data on successful submission
  const clearFormData = () => {
    localStorage.removeItem("partnerFormData");
  };

  // Auto-save draft functionality
  useEffect(() => {
    try {
      const dataToSave = {
        ...formData,
        currentStep,
        timestamp: Date.now()
      };
      localStorage.setItem("partnerFormData", JSON.stringify(dataToSave));
    } catch (error) {
      console.log("Error saving form data:", error);
    }
  }, [formData, currentStep]);

  // Restore on reload
  useEffect(() => {
    try {
      const saved = localStorage.getItem("partnerFormData");
      if (saved) {
        const parsedData = JSON.parse(saved);
        
        // Only restore if data is recent (within 24 hours)
        const isRecent = (Date.now() - parsedData.timestamp) < 24 * 60 * 60 * 1000;
        
        if (isRecent) {
          // Restore form data
          setFormData({
            restaurantName: parsedData.restaurantName || "",
            ownerName: parsedData.ownerName || "",
            email: parsedData.email || "",
            phone: parsedData.phone || "",
            address: parsedData.address || "",
            city: parsedData.city || "",
            cuisine: parsedData.cuisine || [],
            fssai: parsedData.fssai || "",
            accountNumber: parsedData.accountNumber || "",
            ifsc: parsedData.ifsc || "",
            accountHolder: parsedData.accountHolder || "",
          });
          
          // Restore current step if valid
          if (parsedData.currentStep && parsedData.currentStep >= 1 && parsedData.currentStep <= 5) {
            setCurrentStep(parsedData.currentStep);
          }
        }
      }
    } catch (error) {
      console.log("Error restoring form data:", error);
      // Clear corrupted data
      localStorage.removeItem("partnerFormData");
    }
  }, []);

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

  const validateAccountNumber = (accountNumber) => {
    // Account number should be 9-18 digits
    const accountRegex = /^\d{9,18}$/;
    return accountRegex.test(accountNumber.replace(/\s/g, ''));
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
      } else if (!validateAccountNumber(formData.accountNumber)) {
        newErrors.accountNumber = "Account number should be 9-18 digits";
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
        // Clear form data on successful submission
        clearFormData();
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
    <div className="h-screen bg-gradient-to-br from-gray-50 to-orange-50 overflow-hidden">
      {/* Sticky Header + Stepper */}
      <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          
          {/* Header */}
          <div className="flex items-center justify-center gap-2 mb-3 md:hidden">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center">
              <Store className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold">HaveIt Partner</span>
          </div>

          {/* Mobile Progress */}
          <div className="md:hidden">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Step {currentStep} of {steps.length}</span>
              <span>{steps[currentStep - 1].name}</span>
            </div>
            <div className="w-full h-1 bg-gray-200 rounded-full">
              <div
                className="h-1 bg-orange-600 rounded-full transition-all"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Split Layout */}
      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 h-full px-4">
        
        {/* Left Panel - Branding + Vertical Stepper (Sticky) */}
        <div className="hidden md:flex flex-col h-full sticky top-0 py-10">
          
          {/* Logo */}
          <div>
            <div className="flex items-center gap-2 mb-10">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Store className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-semibold">HaveIt Partner</span>
            </div>

            {/* Stepper */}
            <div className="space-y-8">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-start gap-4 relative">
                  
                  {/* Vertical Line */}
                  {index !== steps.length - 1 && (
                    <div className="absolute left-[15px] top-8 h-full w-[2px] bg-gray-200"></div>
                  )}

                  {/* Active Progress Line */}
                  {index !== steps.length - 1 && currentStep > step.id && (
                    <div className="absolute left-[15px] top-8 h-full w-[2px] bg-orange-600"></div>
                  )}

                  {/* Circle */}
                  <div
                    className={`w-8 h-8 flex items-center justify-center rounded-full border-2 z-10 bg-white
                    ${
                      currentStep > step.id
                        ? "bg-orange-600 border-orange-600 text-white"
                        : currentStep === step.id
                        ? "border-orange-600 text-orange-600 ring-4 ring-orange-100"
                        : "border-gray-300 text-gray-400"
                    }`}
                  >
                    {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                  </div>

                  {/* Content */}
                  <div className="pt-1">
                    <p
                      className={`text-sm font-medium ${
                        currentStep >= step.id ? "text-gray-900" : "text-gray-400"
                      }`}
                    >
                      {step.name}
                    </p>

                    {currentStep === step.id && (
                      <p className="text-xs text-gray-500 mt-1">
                        Fill required details
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom fixed content */}
          <div className="mt-auto text-sm text-gray-500">
            Need help? Contact support
          </div>
        </div>

        {/* Right Panel - Form Area (Scrollable) */}
        <div className="md:col-span-2 h-full overflow-y-auto py-10 pr-2">
          
          <h1 className="text-3xl font-bold mb-2">
            Register Your Restaurant
          </h1>
          <p className="text-gray-600 mb-6">
            Complete the steps below to get started
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-10 border mb-20">

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
            >
          {currentStep === 1 && (
            <div className="space-y-6">
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
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
            <div className="space-y-6">
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
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
            <div className="space-y-6">
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
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Bank Details</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Number</label>
                <input
                  type="text"
                  value={formData.accountNumber}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, accountNumber: value });
                    
                    // Real-time validation
                    if (value.trim() && !validateAccountNumber(value)) {
                      setErrors({ ...errors, accountNumber: "Account number should be 9-18 digits" });
                    } else if (errors.accountNumber) {
                      setErrors({ ...errors, accountNumber: "" });
                    }
                  }}
                  placeholder="Enter account number"
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-200 focus:scale-[1.01] ${
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
            <div className="space-y-6">
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
            </motion.div>
          </AnimatePresence>
          </div>

          {/* Sticky Bottom CTA */}
          <div className="sticky bottom-0 bg-white border-t p-4">
            <div className="flex justify-end gap-3">
              {currentStep > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-6 py-3 border rounded-lg"
                >
                  Back
                </button>
              ) : (
                <Link to="/" className="px-6 py-3 border rounded-lg text-center">
                  Cancel
                </Link>
              )}

              <button
                onClick={handleNext}
                className="px-6 py-3 bg-orange-600 text-white rounded-lg shadow-md"
              >
                {currentStep === 5 ? "Submit" : "Continue"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegistrationPage;
