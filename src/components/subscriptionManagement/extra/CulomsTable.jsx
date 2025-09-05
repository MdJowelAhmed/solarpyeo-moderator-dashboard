import React from "react";
import { Button, Tag, Tooltip, Modal, message } from "antd";
import { FaFilePdf, FaEdit } from "react-icons/fa";
import { MdGavel } from "react-icons/md";
import { getStatusColor } from "./sampleData";
// import { getStatusColor } from "./sampleData";
// import { getStatusColor } from "./sampleData";
// import { getStatusColor } from '../data/sampleData';

export const TableColumns = (actionHandlers) => {
  const {
    showPDFModal,
    showAcceptModal,
    showJuryModal,
    showEditModal,
    handleReject
  } = actionHandlers;

//   const handleRejectConfirm = (record) => {
//     Modal.confirm({
//       title: 'Are you sure?',
//       content: 'Do you want to reject this submission?',
//       okText: 'Yes, Reject',
//       cancelText: 'Cancel',
//       onOk() {
//         handleReject(record);
//       }
//     });
//   };

  return [
    {
      title: "SL",
      dataIndex: "id",
      key: "id",
      align: "center",
      width: 60,
    },
    {
      title: "Initiator Name",
      dataIndex: "initiatorName",
      key: "initiatorName",
      align: "center",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
    },
    {
      title: "Respondent Name",
      dataIndex: "respondentName",
      key: "respondentName",
      align: "center",
    },
    {
      title: "Case Type",
      dataIndex: "caseType",
      key: "caseType",
      align: "center",
    },
    {
      title: "Moderator Name",
      dataIndex: "moderatorName",
      key: "moderatorName",
      align: "center",
    },
    {
      title: "Jury Vote",
      dataIndex: "jurorVote",
      key: "jurorVote",
      align: "center",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>,
    },
    {
      title: "Action",
      key: "action",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-center gap-2 flex-wrap">
          {/* View Details Button - Always available */}
          <Tooltip title="View Case Details & Documents">
            <Button
              type="primary"
              // icon={<FaFilePdf />}
              onClick={() => showPDFModal(record)}
              size="middle"
              className="hover:shadow-lg transition-all duration-200"
              style={{
                background: "linear-gradient(135deg, #1890ff 0%, #096dd9 100%)",
                border: "none",
                borderRadius: "6px",
                fontWeight: "500",
              }}
            >
              Details
            </Button>
          </Tooltip>

          {/* Proven Button - Enhanced for initial submissions */}
          {(record.status === "Running" || record.status === "Pending") && (
            <Tooltip title="Approve & Send to Jury Panel">
              <Button
                onClick={() => showAcceptModal(record)}
                size="middle"
                className="hover:shadow-lg transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #52c41a 0%, #389e0d 100%)",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Proven
              </Button>
            </Tooltip>
          )}

          {/* Jury Decision Button - Enhanced for jury review */}
          {(record.status === "Sent to Jury" || record.status === "Under Jury Review") && (
            <Tooltip title="Submit Jury Verdict">
              <Button
                // icon={<MdGavel />}
                onClick={() => showJuryModal(record)}
                size="middle"
                className="hover:shadow-lg transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #722ed1 0%, #531dab 100%)",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Jury Vote
              </Button>
            </Tooltip>
          )}

          {/* Final Review Button - Enhanced for final decisions */}
          {/* {record.status === "Final Review" && (
            <Tooltip title="Make Final Administrative Decision">
              <Button
                // icon={<FaEdit />}
                onClick={() => showEditModal(record)}
                size="middle"
                className="hover:shadow-lg transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #13c2c2 0%, #08979c 100%)",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Final Decision
              </Button>
            </Tooltip>
          )} */}

          {/* Unable to Decide Button - For complex cases */}
          {![
"Rejected", "Finalized", "Completed"].includes(record.status) && (
            <Tooltip title="Mark as Unable to Decide - Requires Further Review">
              <Button
                onClick={() => handleReject(record, 'unable')}
                size="middle"
                className="hover:shadow-lg transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #faad14 0%, #d48806 100%)",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Unable to Decide
              </Button>
            </Tooltip>
          )}

          {/* Disproven Button - For rejected cases */}
          {![
"Rejected", "Finalized", "Completed"].includes(record.status) && (
            <Tooltip title="Reject & Mark as Disproven">
              <Button
                onClick={() => handleReject(record, 'disproven')}
                size="middle"
                className="hover:shadow-lg transition-all duration-200"
                style={{
                  background: "linear-gradient(135deg, #f5222d 0%, #cf1322 100%)",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  fontWeight: "500",
                }}
              >
                Disproven
              </Button>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
};