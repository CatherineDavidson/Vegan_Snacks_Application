import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import PopUp from "./components/PopUp"; // import your popup component

const REQUIRED_DOCS = [
  { key: "BUSINESS_LICENSE", label: "Business License" },
  { key: "LIABILITY_INSURANCE", label: "Liability Insurance" },
  { key: "VEGAN_CERTIFICATION", label: "Vegan Certification" },
];

const REQUIRED_COMPLIANCE = [
  { key: "HACCP", label: "HACCP" },
  { key: "FDA_REGISTRATION", label: "FDA Registration" },
  { key: "LOCAL_HEALTH_PERMIT", label: "Local Compliance" },
];

export default function VendorApprovalDetails() {
  const { vendorId } = useParams();
  const [vendor, setVendor] = useState(null);
  const [tab, setTab] = useState("documents");

  // Modal state
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [expiryDate, setExpiryDate] = useState("");

  // Toast state
  const [toast, setToast] = useState(null); // {type:'success'|'error', msg:string, showPopup: boolean}

  const todayStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const navigate = useNavigate();
  const goBack = () => {
    navigate(-1); // goes one step back in browser history
  };
  const loadVendor = () =>
    axios
      .get(`/api/vendor/${vendorId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setVendor(res.data));

  useEffect(() => {
    if (vendorId) loadVendor().catch(console.error);
  }, [vendorId]);

  const docsByType = useMemo(() => {
    const map = {};
    (vendor?.documents || []).forEach((d) => (map[d.documentType] = d));
    return map;
  }, [vendor]);

  const complianceByType = useMemo(() => {
    const map = {};
    (vendor?.complianceRecords || []).forEach((c) => (map[c.complianceType] = c));
    return map;
  }, [vendor]);

  const docsToRender = REQUIRED_DOCS.map((rd) => {
    const found = docsByType[rd.key];
    return found
      ? found
      : {
          id: `missing-${rd.key}`,
          documentType: rd.key,
          fileUrl: null,
          verificationStatus: "REQUIRED",
          _missing: true,
        };
  });

  const complianceToRender = REQUIRED_COMPLIANCE.map((rc) => {
    const found = complianceByType[rc.key];
    return found
      ? found
      : {
          complianceId: `missing-${rc.key}`,
          complianceType: rc.key,
          status: "REQUIRED",
          _missing: true,
        };
  });

  const statusPill = (status) => {
    const s = (status || "PENDING").toUpperCase();
    const map = {
      VERIFIED: "bg-green-100 text-green-800 border-green-200",
      COMPLIANT: "bg-green-100 text-green-800 border-green-200",
      REJECTED: "bg-red-100 text-red-800 border-red-200",
      NON_COMPLIANT: "bg-red-100 text-red-800 border-red-200",
      REQUIRED: "bg-gray-100 text-gray-700 border-gray-200",
      PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${map[s] || map.PENDING}`;
  };

  const showToast = (type, msg) => {
    // Show popup only for successful approval/rejection
    if (type === "success" && (msg.toLowerCase().includes("verified") || msg.toLowerCase().includes("rejected"))) {
      setToast({ type, msg, showPopup: true });
    } else {
      setToast({ type, msg, showPopup: false });
      setTimeout(() => setToast(null), 2400);
    }
  };

  const handleVerify = async (docId, status) => {
    try {
      if (status === "VERIFIED" && !expiryDate) {
        showToast("error", "Please set an expiry date before approving.");
        return;
      }
      if (status === "REJECTED" && !remarks.trim()) {
        showToast("error", "Please add remarks before rejecting.");
        return;
      }

      await axios.put(
        `/api/vendor/document/${docId}/status`,
        null,
        {
          params: { status, remarks, expiryDate },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      await loadVendor();

      showToast(
        "success",
        `${(selectedDoc?.documentType || "Document").replace(/_/g, " ")} ${status.toLowerCase()} successfully`
      );
      setSelectedDoc(null);
      setRemarks("");
      setExpiryDate("");
    } catch (err) {
      console.error(err);
      showToast("error", "Unable to update document status.");
    }
  };

  const updateComplianceStatus = async (compId, status) => {
    try {
      await axios.put(
        `/api/vendor/compliance/${compId}/status`,
        null,
        {
          params: { status },
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      await loadVendor();
      showToast("success", `Compliance ${status.toLowerCase()} successfully`);
    } catch (err) {
      console.error(err);
      showToast("error", "Unable to update compliance status.");
    }
  };

  if (!vendor) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 relative">
      {/* Header */}
            <button
      onClick={goBack}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      Back
    </button>
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">
            {vendor.companyName?.charAt(0).toUpperCase() || "V"}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{vendor.companyName}</h2>
            <p className="text-sm text-gray-500">Vendor ID: {vendorId}</p>
          </div>
        </div>
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {(vendor.registrationStatus || "PENDING").replace(/_/g, " ")}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          <button
            onClick={() => setTab("documents")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              tab === "documents"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Documents
          </button>
          <button
            onClick={() => setTab("compliance")}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              tab === "compliance"
                ? "border-indigo-500 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Compliance
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="p-6">
        {tab === "documents" && (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">File</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {docsToRender.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {(doc.documentType || "").replace(/_/g, " ")}
                      </div>
                      {!doc._missing && (
                        <div className="text-xs text-gray-500">ID: {doc.id}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {doc._missing ? (
                        <span className="text-sm text-gray-500">Document required</span>
                      ) : (
                        <a
                          href={doc.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
                        >
                          View
                        </a>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={statusPill(doc.verificationStatus)}>
                        {(doc.verificationStatus || "PENDING").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {!doc._missing ? (
                        <button
                          onClick={() => {
                            setSelectedDoc(doc);
                            setRemarks("");
                            setExpiryDate("");
                          }}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                        >
                          Verify
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "compliance" && (
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Compliance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {complianceToRender.map((c) => (
                  <tr key={c.complianceId} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {(c.complianceType || "").replace(/_/g, " ")}
                      </div>
                      {!c._missing && (
                        <div className="text-xs text-gray-500">ID: {c.complianceId}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={statusPill(c.status)}>
                        {(c.status || "PENDING").replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {!c._missing ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateComplianceStatus(c.complianceId, "COMPLIANT")}
                            className="px-3 py-1 rounded-md bg-green-600 text-white text-sm hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => updateComplianceStatus(c.complianceId, "NON_COMPLIANT")}
                            className="px-3 py-1 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400">Required</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Verification Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-height-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setSelectedDoc(null)}
            />
            <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">
                  Verify {(selectedDoc.documentType || "").replace(/_/g, " ")}
                </h3>
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Preview */}
                <div>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    {selectedDoc.fileUrl ? (
                      <img
                        src={selectedDoc.fileUrl}
                        alt="Document"
                        className="mx-auto max-h-96 rounded"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <div className="text-center text-sm text-gray-500">
                        Preview not available
                      </div>
                    )}
                  </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Expiry Date</label>
                    <input
                      type="date"
                      value={expiryDate}
                      onChange={(e) => setExpiryDate(e.target.value)}
                      min={todayStr}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                    <p className="mt-1 text-xs text-gray-500">Required for approval.</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Remarks</label>
                    <textarea
                      rows={4}
                      value={remarks}
                      onChange={(e) => setRemarks(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Add notes for this verification"
                    />
                  </div>

                  <div className="bg-gray-50 rounded p-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current status:</span>
                      <span className={statusPill(selectedDoc.verificationStatus)}>
                        {(selectedDoc.verificationStatus || "PENDING").replace(/_/g, " ")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 flex flex-col sm:flex-row sm:justify-end gap-3">
                <button
                  onClick={() => setSelectedDoc(null)}
                  className="px-5 py-2 rounded-md border border-gray-300"
                >
                  Cancel
                </button>

                {selectedDoc.verificationStatus !== "REJECTED" && selectedDoc.verificationStatus !== "VERIFIED" && (
                  <>
                    <button
                      onClick={() => handleVerify(selectedDoc.id, "REJECTED")}
                      className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleVerify(selectedDoc.id, "VERIFIED")}
                      className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                    >
                      Approve
                    </button>
                  </>
                )}

                {selectedDoc.verificationStatus === "VERIFIED" && (
                  <button
                    onClick={() => handleVerify(selectedDoc.id, "REJECTED")}
                    className="px-5 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
                  >
                    Reject
                  </button>
                )}

                {selectedDoc.verificationStatus === "REJECTED" && (
                  <button
                    onClick={() => handleVerify(selectedDoc.id, "VERIFIED")}
                    className="px-5 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast / PopUp */}
      {toast?.showPopup && (
        <PopUp
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      {toast && !toast.showPopup && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-lg text-sm text-white ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  );
}
