// // AdminVendorApprovals.js
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function AdminVendorApprovals({ onSelectVendor }) {
//   const [vendors, setVendors] = useState([]);
//   const navigate = useNavigate();

//   useEffect(() => {
//     axios.get("/api/vendor/pending-approvals", {
//       headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
//     }).then(res => setVendors(res.data));
//   }, []);

//   return (
//     <div className="bg-white shadow rounded-lg p-6">
//       <h2 className="text-lg font-bold mb-4">Pending Vendor Approvals</h2>
//       <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2 border">Vendor</th>
//             <th className="p-2 border">Email</th>
//             <th className="p-2 border">Contact</th>
//             <th className="p-2 border">Created</th>
//             <th className="p-2 border">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {vendors.map(v => (
//             <tr key={v.vendorId} className="hover:bg-gray-50">
//               <td className="p-2 border">{v.companyName}</td>
//               <td className="p-2 border">{v.businessEmail}</td>
//               <td className="p-2 border">{v.primaryContactNumber}</td>
//               <td className="p-2 border">{new Date(v.createdAt).toLocaleDateString()}</td>
//               <td className="p-2 border">
//                 <button
//                     onClick={() => navigate(`/va/${v.vendorId}`)}

//                   className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600"
//                 >
//                   View
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const STATUSES = [
  "ALL_NON_APPROVED",
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "DOCUMENTS_REQUIRED",
  "REJECTED",
  "SUSPENDED",
  "INACTIVE",
  "PENDING",
];

export default function AdminVendorApprovals() {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL_NON_APPROVED");
  const navigate = useNavigate();

  useEffect(() => {
    // You can keep your old endpoint if it returns everything and then filter client-side.
    // This endpoint is provided in the backend section below.
    axios
      .get("/api/vendor/review-list", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => setVendors(res.data || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);
  const goBack = () => {
    navigate(-1); // goes one step back in browser history
  };
  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return (vendors || [])
      .filter((v) => v.registrationStatus !== "APPROVED") // hard guard
      .filter((v) => {
        if (statusFilter === "ALL_NON_APPROVED") return true;
        return (v.registrationStatus || "").toUpperCase() === statusFilter;
      })
      .filter((v) => {
        if (!term) return true;
        return (
          (v.companyName || "").toLowerCase().includes(term) ||
          (v.businessEmail || "").toLowerCase().includes(term) ||
          String(v.vendorId || "").includes(term)
        );
      });
  }, [vendors, searchTerm, statusFilter]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-6 w-1/3"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header + Filters */}

      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vendor Review Queue</h2>
            <p className="text-sm text-gray-500">
              Showing vendors with registration status not approved
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative w-full sm:w-72">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search by vendor, email or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full sm:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-lg"
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s === "ALL_NON_APPROVED" ? "All (not APPROVED)" : s.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vendor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Applied</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filtered.map((v) => (
              <tr key={v.vendorId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-indigo-600 text-white flex items-center justify-center">
                      {v.companyName?.[0]?.toUpperCase() || "V"}
                    </div>
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">{v.companyName}</div>
                      <div className="text-xs text-gray-500">ID: {v.vendorId}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{v.businessEmail}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{v.primaryContactNumber || "-"}</td>
                <td className="px-6 py-4 text-sm text-gray-900">
                  {v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "-"}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {(v.registrationStatus || "PENDING").replace(/_/g, " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/admin/vendor-approvals/${v.vendorId}`)}
                    className="inline-flex items-center px-4 py-2 rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Review
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-sm text-gray-500">No matching vendors.</div>
        )}
      </div>
    </div>
  );
}
