import React, { useState, useEffect, useMemo } from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf } from "react-icons/fa";
import { StepBack , ArrowBigLeft} from "lucide-react";
import PopUp from "./components/PopUp";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const REQUIRED_DOCUMENTS = [
  { key: "BUSINESS_LICENSE", label: "Business License" },
  { key: "LIABILITY_INSURANCE", label: "Liability Insurance" },
  { key: "VEGAN_CERTIFICATION", label: "Vegan Certification" },
];

const REQUIRED_COMPLIANCE = [
  { key: "HACCP", label: "HACCP" },
  { key: "FDA_REGISTRATION", label: "FDA Registration" },
  { key: "LOCAL_HEALTH_PERMIT", label: "Local Health Permit" },
];

const VendorStatus = ({ status }) => {
  let icon, label, dotColor, iconColor, textColor;

  switch (status) {
    case "APPROVED":
      icon = <FaCheckCircle className="text-green-600" />;
      dotColor = "bg-green-600";
      textColor = "text-green-800";
      label = "Verified";
      break;
    case "REJECTED":
      icon = <FaTimesCircle className="text-red-600" />;
      dotColor = "bg-red-600";
      textColor = "text-red-800";
      label = "Rejected";
      break;
    case "PENDING":
    default:
      icon = <FaHourglassHalf className="text-yellow-600" />;
      dotColor = "bg-yellow-600";
      textColor = "text-yellow-800";
      label = "Pending";
      break;
  }

  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className={`w-2 h-2 rounded-full ${dotColor}`}></div>
      {icon}
      <span className={`${textColor} font-medium text-sm`}>{label}</span>
    </div>
  );
};

const VendorProfile = () => {
  const [vendor, setVendor] = useState({});
  const [documents, setDocuments] = useState([]);
  const [compliances, setCompliances] = useState([]);
  const [editable, setEditable] = useState(false);
  const [file, setFile] = useState(null);
  const [docType, setDocType] = useState("BUSINESS_LICENSE");
  const [popup, setPopup] = useState({ message: "", type: "success" });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPopup, setUploadPopup] = useState({ open: false, documentType: "" });
  
  // Compliance modal states
  const [complianceModal, setComplianceModal] = useState({ 
    open: false, 
    complianceType: "", 
    isEdit: false, 
    editIndex: -1 
  });
  const [complianceForm, setComplianceForm] = useState({
    complianceType: "",
    certificationNumber: "",
    issuingAuthority: "",
    issueDate: "",
    expiryDate: "",
    notes: "",
    requiresRenewal: true,
    status: "PENDING",
  });

  // Confirmation modal states
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedUpdate, setSelectedUpdate] = useState(null);

  // ---------- helpers ----------
  const showPopup = (message, type = "success") => setPopup({ message, type });
  const closePopup = () => setPopup({ message: "", type: "success" });

  const refreshDocuments = async () => {
    try {
      const res = await axios.get("/api/vendor/uploadedDocs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDocuments(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const refreshCompliances = async () => {
    try {
      const res = await axios.get(`/api/vendor/compliance/${vendor.vendorId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setCompliances(res.data || []);
    } catch (err) { 
      console.error(err); 
    }
  };

  const profileFields = [
    "companyName",
    "businessEmail",
    "primaryContactNumber",
    "businessDescription",
    "businessRegistrationNumber",
    "taxId",
    "establishedYear",
    "websiteUrl",
    "streetAddress1",
    "streetAddress2",
    "city",
    "state",
    "postalCode",
  ];

  const completion = useMemo(() => {
    const done = profileFields.filter(
      (k) => vendor?.[k] !== undefined && String(vendor[k]).trim().length > 0
    ).length;
    const pct = Math.round((done / profileFields.length) * 100) || 0;
    return { done, total: profileFields.length, pct };
  }, [vendor]);

  const stats = useMemo(() => {
    const total = documents.length;
    const approved = documents.filter((d) => d.verificationStatus === "APPROVED" || d.verificationStatus === "VERIFIED").length;
    const pending = documents.filter((d) => d.verificationStatus === "PENDING").length;
    const rejected = documents.filter((d) => d.verificationStatus === "REJECTED").length;
    return { total, approved, pending, rejected };
  }, [documents]);

  const initials = useMemo(() => {
    const name = vendor?.companyName || "Vendor";
    const parts = name.trim().split(/\s+/);
    return (parts[0]?.[0] || "V") + (parts[1]?.[0] || "");
  }, [vendor]);

  // Merge uploaded docs with required docs
  const mergedDocuments = useMemo(() => {
    return REQUIRED_DOCUMENTS.map((reqDoc) => {
      const existing = documents.find((d) => d.documentType === reqDoc.key);
      return existing || { 
        documentType: reqDoc.key, 
        status: "Not uploaded",
        verificationStatus: "NOT_UPLOADED"
      };
    });
  }, [documents]);

  // Merge compliances with required compliance
  const mergedCompliances = useMemo(() => {
    return REQUIRED_COMPLIANCE.map((reqComp) => {
      const existing = compliances.find((c) => c.complianceType === reqComp.key);
      return existing || { 
        complianceType: reqComp.key, 
        status: "Not uploaded",
        certificationNumber: "",
        issuingAuthority: "",
        issueDate: "",
        expiryDate: "",
        notes: ""
      };
    });
  }, [compliances]);

  // ---------- effects ----------
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/api/vendor/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        setVendor(res.data || {});
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
    refreshDocuments();
  }, []);

  useEffect(() => {
    if (vendor.vendorId) {
      refreshCompliances();
    }
  }, [vendor.vendorId]);

  // ---------- handlers ----------
  const handleChange = (e) => setVendor({ ...vendor, [e.target.name]: e.target.value });

  const handleComplianceFormChange = (field, value) => {
    setComplianceForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddCompliance = () => {
    setComplianceForm({
      complianceType: REQUIRED_COMPLIANCE[0].key,
      certificationNumber: "",
      issuingAuthority: "",
      issueDate: "",
      expiryDate: "",
      notes: "",
      requiresRenewal: true,
      status: "PENDING",
    });
    setComplianceModal({ 
      open: true, 
      complianceType: REQUIRED_COMPLIANCE[0].key, 
      isEdit: false, 
      editIndex: -1 
    });
  };

  const handleEditCompliance = (comp, index) => {
    setComplianceForm({
      complianceId: comp.id,
      complianceType: comp.complianceType,
      certificationNumber: comp.certificationNumber || "",
      issuingAuthority: comp.issuingAuthority || "",
      issueDate: comp.issueDate || "",
      expiryDate: comp.expiryDate || "",
      notes: comp.notes || "",
      requiresRenewal: comp.requiresRenewal !== false,
      status: comp.status || "PENDING",
    });
    setComplianceModal({ 
      open: true, 
      complianceType: comp.complianceType, 
      isEdit: true, 
      editIndex: index 
    });
  };

  const handleComplianceSubmit = async () => {
    try {
      if (!complianceForm.certificationNumber.trim()) {
        showPopup("Please enter certification number", "error");
        return;
      }
      if (!complianceForm.issuingAuthority.trim()) {
        showPopup("Please enter issuing authority", "error");
        return;
      }
      if (!complianceForm.issueDate) {
        showPopup("Please enter issue date", "error");
        return;
      }
      if (!complianceForm.expiryDate) {
        showPopup("Please enter expiry date", "error");
        return;
      }

      const endpoint = complianceModal.isEdit 
        ? `/api/vendor/${vendor.vendorId}/compliance/${complianceForm.complianceId}`
        : `/api/vendor/${vendor.vendorId}/compliance`;
      
      const method = complianceModal.isEdit ? 'put' : 'post';

      await axios[method](endpoint, complianceForm, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      
      showPopup(`Compliance ${complianceModal.isEdit ? 'updated' : 'submitted'} successfully!`, "success");
      setComplianceModal({ open: false, complianceType: "", isEdit: false, editIndex: -1 });
      refreshCompliances();
    } catch (err) {
      console.error(err);
      showPopup(`Failed to ${complianceModal.isEdit ? 'update' : 'submit'} compliance`, "error");
    }
  };

  const handleDelete = async (docId) => {
    if (!window.confirm("Are you sure you want to delete this document?")) return;
    try {
      await axios.delete(`/api/vendor/delete-document/${docId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      showPopup("Document deleted successfully!", "success");
      refreshDocuments();
    } catch (err) {
      console.error(err);
      showPopup(err.response?.data || "Failed to delete document", "error");
    }
  };

  const handleProfileUpdate = async () => {
    try {
      await axios.put("/api/vendor/updateProfile", vendor, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      showPopup("Profile updated successfully!", "success");
      setEditable(false);
    } catch (err) {
      console.error(err);
      showPopup("Failed to update profile", "error");
    }
  };

  const handleDocumentUpload = async (typeOverride) => {
    const type = typeOverride || docType;
    if (!file) {
      showPopup("Please select a file first!", "error");
      return;
    }

    try {
      setIsUploading(true);

      // Step 1: check if exists
      const existsRes = await axios.get(`/api/vendor/document-exists`, {
        params: { type },
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      let overwrite = false;
      if (existsRes.data === true) {
        const confirmOverwrite = window.confirm(
          `A document of type "${type}" already exists. Do you want to replace it?`
        );
        if (!confirmOverwrite) {
          setIsUploading(false);
          return;
        }
        overwrite = true;
      }

      // Step 2: upload
      const formData = new FormData();
      formData.append("documentType", type);
      formData.append("file", file);
      formData.append("overwrite", overwrite);

      await axios.post("/api/vendor/upload-document", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      showPopup("Document uploaded successfully!", "success");
      setFile(null);
      setUploadPopup({ open: false, documentType: "" });
      refreshDocuments();
    } catch (err) {
      console.error(err);
      showPopup(err.response?.data || "Failed to upload document", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const statusPill = (s) => {
    const base = "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold";
    if (s === "APPROVED" || s === "VERIFIED") return `${base} bg-emerald-100 text-emerald-800 border border-emerald-200`;
    if (s === "PENDING") return `${base} bg-amber-100 text-amber-800 border border-amber-200`;
    if (s === "REJECTED") return `${base} bg-rose-100 text-rose-800 border border-rose-200`;
    if (s === "Not uploaded" || s === "NOT_UPLOADED") return `${base} bg-gray-100 text-gray-600 border border-gray-200`;
    return `${base} bg-gray-100 text-gray-800 border border-gray-200`;
  };
const navigate = useNavigate();
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-indigo-50 via-white to-emerald-50">


      {/* Top hero / header */}
      <div className="relative">
        {/* Hero Gradient Background */}
        <div className="absolute inset-0 h-[50vh] bg-gradient-to-r from-indigo-700 via-purple-700 to-emerald-700" />
         <button onClick={()=>{navigate('/vendor')}} className="p-2 mt-6 ml-6 mb-0 text-gray-500 hover:text-gray-700 relative bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">
            <ArrowBigLeft/>
          </button>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-20">
         
          {/* Vendor Avatar + Name */}
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 rounded-full shadow-xl ring-4 ring-white bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
              {initials}
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-extrabold tracking-tight drop-shadow-lg">
                {vendor.companyName || "Your Company"}
              </h1>
              <p className="text-white/80 drop-shadow">
                {vendor.businessDescription || "Tell customers what you do..."}
              </p>
              <p>{vendor.registrationStatus }</p>
              <VendorStatus status={vendor.registrationStatus} />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            {/* Profile Completion */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
              <div className="text-sm text-gray-500">Profile Completion</div>
              <div className="mt-2 flex items-center gap-3">
                <div className="flex-1">
                  <div className="h-2.5 rounded-full bg-gray-200 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"
                      style={{ width: `${completion.pct}%` }}
                    />
                  </div>
                </div>
                <div className="text-lg font-bold text-gray-800">{completion.pct}%</div>
              </div>
              <div className="text-xs mt-1 text-gray-500">
                {completion.done}/{completion.total} fields completed
              </div>
            </div>

            {/* Total Docs */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
              <div className="text-sm text-gray-500">Total Documents</div>
              <div className="text-2xl font-bold mt-1 text-gray-800">{stats.total}</div>
            </div>

            {/* Approved */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
              <div className="text-sm text-gray-500">Approved</div>
              <div className="text-2xl font-bold mt-1 text-gray-800">{stats.approved}</div>
            </div>

            {/* Pending */}
            <div className="bg-white rounded-2xl p-4 shadow-md border border-gray-200">
              <div className="text-sm text-gray-500">Pending</div>
              <div className="text-2xl font-bold mt-1 text-gray-800">{stats.pending}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 relative z-10">
              <div className="flex items-start justify-between">
                <h2 className="text-lg font-semibold text-gray-900">Business Profile</h2>
                {!editable ? (
  <button
    type="button"
    onClick={() => setEditable(true)}
    className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium shadow hover:shadow-md"
  >
    Edit
  </button>
) : (
  <div className="flex gap-2">
    <button
      type="button"
      onClick={handleProfileUpdate}
      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow hover:shadow-md"
    >
      Save
    </button>
    <button
      type="button"
      onClick={() => setEditable(false)}
      className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
    >
      Cancel
    </button>
  </div>
)}

              </div>

              <div className="mt-6 space-y-4">
                {/* Top quick fields */}
                <div className="grid grid-cols-1 gap-4">
                  <input
                    name="companyName"
                    placeholder="Company Name"
                    value={vendor.companyName || ""}
                    onChange={handleChange}
                    disabled={!editable}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      editable
                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  <input
                    name="businessEmail"
                    placeholder="Business Email"
                    value={vendor.businessEmail || ""}
                    onChange={handleChange}
                    disabled={!editable}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      editable
                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  <input
                    name="primaryContactNumber"
                    placeholder="Primary Contact Number"
                    value={vendor.primaryContactNumber || ""}
                    onChange={handleChange}
                    disabled={!editable}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      editable
                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  <input
                    name="websiteUrl"
                    placeholder="Website URL"
                    value={vendor.websiteUrl || ""}
                    onChange={handleChange}
                    disabled={!editable}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      editable
                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Business Description
                  </label>
                  <textarea
                    name="businessDescription"
                    rows={3}
                    placeholder="Describe your business"
                    value={vendor.businessDescription || ""}
                    onChange={handleChange}
                    disabled={!editable}
                    className={`w-full px-4 py-3 rounded-xl border-2 resize-none ${
                      editable
                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>
            </div>

            {/* Registration card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900">Registration</h3>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <input
                  name="businessRegistrationNumber"
                  placeholder="Business Registration Number"
                  value={vendor.businessRegistrationNumber || ""}
                  onChange={handleChange}
                  disabled={!editable}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    editable
                      ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <input
                  name="taxId"
                  placeholder="Tax ID"
                  value={vendor.taxId || ""}
                  onChange={handleChange}
                  disabled={!editable}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    editable
                      ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <input
                  name="establishedYear"
                  placeholder="Established Year"
                  value={vendor.establishedYear || ""}
                  onChange={handleChange}
                  disabled={!editable}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    editable
                      ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
              </div>
            </div>

            {/* Address card */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900">Address</h3>
              <div className="grid grid-cols-1 gap-4 mt-4">
                <input
                  name="streetAddress1"
                  placeholder="Street Address 1"
                  value={vendor.streetAddress1 || ""}
                  onChange={handleChange}
                  disabled={!editable}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    editable
                      ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <input
                  name="streetAddress2"
                  placeholder="Street Address 2"
                  value={vendor.streetAddress2 || ""}
                  onChange={handleChange}
                  disabled={!editable}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    editable
                      ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                      : "border-gray-200 bg-gray-50"
                  }`}
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <input
                    name="city"
                    placeholder="City"
                    value={vendor.city || ""}
                    onChange={handleChange}
                    disabled={!editable}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      editable
                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  <input
                    name="state"
                    placeholder="State"
                    value={vendor.state || ""}
                    onChange={handleChange}
                    disabled={!editable}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      editable
                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                  <input
                    name="postalCode"
                    placeholder="Postal Code"
                    value={vendor.postalCode || ""}
                    onChange={handleChange}
                    disabled={!editable}
                    className={`w-full px-4 py-3 rounded-xl border-2 ${
                      editable
                        ? "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Documents column */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            {/* Upload panel */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Upload New Document</h3>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  >
                    {REQUIRED_DOCUMENTS.map(doc => (
                      <option key={doc.key} value={doc.key}>{doc.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select File</label>
                  <div
                    className="w-full px-4 py-6 rounded-xl border-2 border-dashed border-emerald-300 text-center text-gray-600 hover:bg-emerald-50 transition"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
                    }}
                  >
                    <input
                      type="file"
                      onChange={(e) => setFile(e.target.files[0])}
                      className="hidden"
                      id="file-input"
                    />
                    <label htmlFor="file-input" className="cursor-pointer">
                      {file ? (
                        <span className="font-medium text-emerald-700">{file.name}</span>
                      ) : (
                        <span>
                          Drag & drop or <span className="text-emerald-700 underline">browse</span>
                        </span>
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex md:justify-end">
                  <button
                    onClick={() => handleDocumentUpload()}
                    disabled={isUploading}
                    className="w-full md:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow hover:shadow-md disabled:opacity-60"
                  >
                    {isUploading ? "Uploading..." : "Upload Document"}
                  </button>
                </div>
              </div>
            </div>

            {/* Documents table */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Uploaded Documents</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 uppercase text-xs bg-gray-50">
                      <th className="px-6 py-3">#</th>
                      <th className="px-6 py-3">Document Type</th>
                      <th className="px-6 py-3">File</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mergedDocuments.map((doc, index) => (
                      <tr key={doc.documentType} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{doc.documentType.replace(/_/g, " ")}</td>
                        <td className="px-6 py-4">
                          {doc.fileUrl ? (
                            <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:text-indigo-800 underline">
                              View File
                            </a>
                          ) : (
                            <span className="text-gray-400 italic">Not uploaded</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={statusPill(doc.verificationStatus || doc.status)}>
                            {(doc.verificationStatus || doc.status || "Not uploaded").replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="px-3 py-2 rounded-lg bg-amber-100 text-amber-800 hover:bg-amber-200 font-medium"
                            onClick={() => setUploadPopup({ open: true, documentType: doc.documentType })}
                          >
                            {doc.fileUrl ? "Replace" : "Upload"}
                          </button>
                          {doc.fileUrl && (
                            <button
                              className="ml-2 px-3 py-2 rounded-lg bg-red-100 text-red-800 hover:bg-red-200 font-medium"
                              onClick={() => handleDelete(doc.id)}
                            >
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Compliance Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Compliance Records</h3>
                <button 
                  onClick={handleAddCompliance} 
                  className="px-4 py-2 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 font-medium"
                >
                  Add Compliance
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-600 uppercase text-xs bg-gray-50">
                      <th className="px-6 py-3">#</th>
                      <th className="px-6 py-3">Compliance Type</th>
                      <th className="px-6 py-3">Certification Number</th>
                      <th className="px-6 py-3">Issuing Authority</th>
                      <th className="px-6 py-3">Expiry Date</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {mergedCompliances.map((comp, index) => (
                      <tr key={comp.complianceType} className="hover:bg-gray-50 transition">
                        <td className="px-6 py-4">{index + 1}</td>
                        <td className="px-6 py-4">{comp.complianceType.replace(/_/g, " ")}</td>
                        <td className="px-6 py-4">
                          {comp.certificationNumber || <span className="text-gray-400 italic">Not provided</span>}
                        </td>
                        <td className="px-6 py-4">
                          {comp.issuingAuthority || <span className="text-gray-400 italic">Not provided</span>}
                        </td>
                        <td className="px-6 py-4">
                          {comp.expiryDate ? new Date(comp.expiryDate).toLocaleDateString() : <span className="text-gray-400 italic">Not set</span>}
                        </td>
                        <td className="px-6 py-4">
                          <span className={statusPill(comp.status)}>
                            {(comp.status || "Not uploaded").replace(/_/g, " ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            className="px-3 py-2 rounded-lg bg-blue-100 text-blue-800 hover:bg-blue-200 font-medium"
                            onClick={() => handleEditCompliance(comp, index)}
                          >
                            {comp.certificationNumber ? "Edit" : "Add"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal (for documents) */}
      {uploadPopup.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[92%] max-w-md rounded-2xl shadow-2xl border border-gray-100 p-6">
            <h4 className="text-lg font-semibold text-gray-900">Upload Document</h4>
            <p className="text-sm text-gray-600 mt-1">
              Document Type:{" "}
              <span className="font-semibold text-gray-800">{uploadPopup.documentType?.replace(/_/g, " ")}</span>
            </p>

            <div className="mt-5">
              <div
                className="w-full px-4 py-6 rounded-xl border-2 border-dashed border-emerald-300 text-center text-gray-600 hover:bg-emerald-50 transition"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
                }}
              >
                <input
                  type="file"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                  id="modal-file-input"
                />
                <label htmlFor="modal-file-input" className="cursor-pointer">
                  {file ? (
                    <span className="font-medium text-emerald-700">{file.name}</span>
                  ) : (
                    <span>
                      Drag & drop or <span className="text-emerald-700 underline">browse</span>
                    </span>
                  )}
                </label>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
                onClick={() => {
                  setUploadPopup({ open: false, documentType: "" });
                  setFile(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow hover:shadow-md"
                onClick={() => handleDocumentUpload(uploadPopup.documentType)}
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compliance Modal (Standard Template) */}
      {complianceModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white w-[95%] max-w-2xl rounded-2xl shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-100 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-gray-900">
                  {complianceModal.isEdit ? "Edit" : "Add"} Compliance Record
                </h4>
                <button
                  onClick={() => setComplianceModal({ open: false, complianceType: "", isEdit: false, editIndex: -1 })}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ×
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-1">
                Complete all required fields for compliance verification
              </p>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Compliance Type */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Compliance Type *
                </label>
                <select
                  value={complianceForm.complianceType}
                  onChange={(e) => handleComplianceFormChange("complianceType", e.target.value)}
                  disabled={complianceModal.isEdit}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${
                    complianceModal.isEdit 
                      ? "border-gray-200 bg-gray-50 text-gray-500" 
                      : "border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  }`}
                >
                  {REQUIRED_COMPLIANCE.map(comp => (
                    <option key={comp.key} value={comp.key}>{comp.label}</option>
                  ))}
                </select>
              </div>

              {/* Grid Layout for Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Certification Number */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Certification Number *
                  </label>
                  <input
                    type="text"
                    value={complianceForm.certificationNumber}
                    onChange={(e) => handleComplianceFormChange("certificationNumber", e.target.value)}
                    placeholder="Enter certification number"
                    className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                {/* Issuing Authority */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issuing Authority *
                  </label>
                  <input
                    type="text"
                    value={complianceForm.issuingAuthority}
                    onChange={(e) => handleComplianceFormChange("issuingAuthority", e.target.value)}
                    placeholder="Enter issuing authority"
                    className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                {/* Issue Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    value={complianceForm.issueDate}
                    onChange={(e) => handleComplianceFormChange("issueDate", e.target.value)}
                    max={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>

                {/* Expiry Date */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={complianceForm.expiryDate}
                    onChange={(e) => handleComplianceFormChange("expiryDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  rows={4}
                  value={complianceForm.notes}
                  onChange={(e) => handleComplianceFormChange("notes", e.target.value)}
                  placeholder="Add any additional notes or comments about this compliance record..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 resize-none"
                />
              </div>

              {/* Requires Renewal Checkbox */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="requiresRenewal"
                  checked={complianceForm.requiresRenewal}
                  onChange={(e) => handleComplianceFormChange("requiresRenewal", e.target.checked)}
                  className="w-4 h-4 text-emerald-600 border-2 border-emerald-300 rounded focus:ring-emerald-500"
                />
                <label htmlFor="requiresRenewal" className="text-sm font-medium text-gray-700">
                  This compliance requires periodic renewal
                </label>
              </div>

              {/* Status Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Current Status:</span>
                  <span className={statusPill(complianceForm.status)}>
                    {complianceForm.status.replace(/_/g, " ")}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Status will be updated to "Pending" upon submission and reviewed by administrators
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 rounded-b-2xl bg-gray-50">
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-500">* Required fields</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setComplianceModal({ open: false, complianceType: "", isEdit: false, editIndex: -1 })}
                    className="px-5 py-2 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleComplianceSubmit}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-semibold shadow hover:shadow-md"
                  >
                    {complianceModal.isEdit ? "Update" : "Submit"} Compliance
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full-screen uploading overlay */}
      {isUploading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="mt-4 text-gray-700 font-semibold">Uploading...</p>
          </div>
        </div>
      )}
    
          {popup.message && <PopUp message={popup.message} type={popup.type} onClose={closePopup} />}
    </div>
  );
};

export default VendorProfile;



