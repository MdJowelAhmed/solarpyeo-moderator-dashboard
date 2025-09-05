import React, { useState } from "react";
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Tooltip,
  message,
  Modal
} from "antd";
import { FaFilePdf, FaEdit } from "react-icons/fa";
import { MdGavel } from "react-icons/md";
import { sampleData } from "./sampleData";
import { TableColumns } from "./CulomsTable";
// import { PDFModal } from "../modals";
import { AcceptModal, EditModal, JuryModal, PDFModal } from "./GeneratePDFContent ";


const { Option } = Select;

const SubmissionManagementCom = () => {
  const [data, setData] = useState(sampleData);
  const [searchText, setSearchText] = useState("");
  const [submissionType, setSubmissionType] = useState("All");
  const [isPDFModalVisible, setIsPDFModalVisible] = useState(false);
  const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
  const [isJuryModalVisible, setIsJuryModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Filter data
  const filteredData = data.filter((item) => {
    const matchesSearch =
      item.initiatorName.toLowerCase().includes(searchText.toLowerCase()) ||
      item.email.toLowerCase().includes(searchText.toLowerCase()) ||
      item.caseType.toLowerCase().includes(searchText.toLowerCase()) ||
      item.submissionType.toLowerCase().includes(searchText.toLowerCase());

    const matchesType =
      submissionType === "All" || item.status === submissionType;

    return matchesSearch && matchesType;
  });

  // Modal handlers
  const showPDFModal = (record) => {
    setSelectedRecord(record);
    setIsPDFModalVisible(true);
  };

  const showAcceptModal = (record) => {
    setSelectedRecord(record);
    setIsAcceptModalVisible(true);
  };

  const showJuryModal = (record) => {
    setSelectedRecord(record);
    setIsJuryModalVisible(true);
  };

  const showEditModal = (record) => {
    setSelectedRecord(record);
    setIsEditModalVisible(true);
  };

  // Action handlers
  const handleAcceptSubmit = () => {
    const updatedData = data.map((item) =>
      item.id === selectedRecord.id ? { ...item, status: "Sent to Jury" } : item
    );
    setData(updatedData);
    setIsAcceptModalVisible(false);
    message.success("Case sent to jury for review!");
  };

  const handleJurySubmit = (juryDecision, juryReason, confidenceLevel, additionalNotes) => {
    if (!juryDecision || !juryReason.trim() || !confidenceLevel) {
      message.error("Please provide decision, detailed reasoning, and confidence level!");
      return false;
    }

    const updatedData = data.map((item) => {
      if (item.id === selectedRecord.id) {
        const newFeedback = [...(item.juryFeedback || []), {
          jurorId: (item.juryFeedback?.length || 0) + 1,
          decision: juryDecision,
          reason: juryReason,
          confidenceLevel: confidenceLevel,
          additionalNotes: additionalNotes || '',
          timestamp: new Date().toISOString()
        }];
        
        const newVoteCount = newFeedback.length;
        const newStatus = newVoteCount === 3 ? "Final Review" : "Under Jury Review";
        
        return {
          ...item,
          juryFeedback: newFeedback,
          jurorVote: `${newVoteCount} of 3`,
          status: newStatus
        };
      }
      return item;
    });
    
    setData(updatedData);
    message.success("Jury decision submitted successfully!");
    return true;
  };

  const handleFinalEdit = (decisions, formValues) => {
    const updatedData = data.map((item) => {
      if (item.id === selectedRecord.id) {
        return {
          ...item,
          status: "Finalized",
          finalDecisions: decisions,
          adminComments: formValues.adminComments,
          finalResult: formValues.finalResult
        };
      }
      return item;
    });
    
    setData(updatedData);
    message.success("Final decision submitted successfully!");
    return true;
  };

  const handleReject = (record, type = 'disproven') => {
    const titles = {
      'disproven': 'Mark as Disproven?',
      'unable': 'Unable to Decide?'
    };
    
    const contents = {
      'disproven': 'This will mark the submission as disproven and rejected. This action cannot be undone.',
      'unable': 'This will mark the case as requiring further review due to insufficient evidence or complexity.'
    };
    
    const statuses = {
      'disproven': 'Rejected',
      'unable': 'Unable to Decide'
    };
    
    const messages = {
      'disproven': 'Submission marked as disproven!',
      'unable': 'Case marked as unable to decide - requires further review!'
    };

    Modal.confirm({
      title: titles[type],
      content: contents[type],
      okText: type === 'disproven' ? 'Yes, Mark as Disproven' : 'Yes, Unable to Decide',
      cancelText: 'Cancel',
      okButtonProps: {
        style: {
          backgroundColor: type === 'disproven' ? '#f5222d' : '#faad14',
          borderColor: type === 'disproven' ? '#f5222d' : '#faad14'
        }
      },
      onOk() {
        const updatedData = data.map((item) =>
          item.id === record.id ? { ...item, status: statuses[type] } : item
        );
        setData(updatedData);
        message.success(messages[type]);
      }
    });
  };

  const actionHandlers = {
    showPDFModal,
    showAcceptModal,
    showJuryModal,
    showEditModal,
    handleReject
  };

  const components = {
    header: {
      row: (props) => (
        <tr
          {...props}
          style={{
            backgroundColor: "#f0f5f9",
            height: "50px",
            color: "secondary",
            fontSize: "18px",
            textAlign: "center",
            padding: "12px",
          }}
        />
      ),
      cell: (props) => (
        <th
          {...props}
          style={{
            color: "secondary",
            fontWeight: "bold",
            fontSize: "18px",
            textAlign: "center",
            padding: "12px",
          }}
        />
      ),
    },
  };

  const columns = TableColumns(actionHandlers);

  return (
    <div className="">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center justify-between w-full gap-2">
          <Input
            placeholder="Search by name, email, case type, or submission type"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            style={{ width: 350, height: 40 }}
          />

          <Select
            value={submissionType}
            onChange={setSubmissionType}
            style={{ width: 200, height: 40 }}
          >
            <Option value="All">All Status</Option>
            <Option value="Pending">Pending</Option>
            <Option value="Under Jury Review">Under Jury Review</Option>
            <Option value="Final Review">Final Review</Option>
            <Option value="Rejected">Rejected</Option>
            <Option value="Completed">Completed</Option>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="responsive-table">
        <Table
          components={components}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{
            pageSize: 10,
          }}
          scroll={{ x: 'max-content' }}
          className="custom-table"
        />
      </div>

      {/* Modals */}
      <PDFModal
        visible={isPDFModalVisible}
        onCancel={() => setIsPDFModalVisible(false)}
        selectedRecord={selectedRecord}
      />

      <AcceptModal
        visible={isAcceptModalVisible}
        onCancel={() => setIsAcceptModalVisible(false)}
        onOk={handleAcceptSubmit}
        selectedRecord={selectedRecord}
      />

      <JuryModal
        visible={isJuryModalVisible}
        onCancel={() => setIsJuryModalVisible(false)}
        onSubmit={handleJurySubmit}
        selectedRecord={selectedRecord}
      />

      <EditModal
        visible={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        onSubmit={handleFinalEdit}
        selectedRecord={selectedRecord}
      />
    </div>
  );
};

export default SubmissionManagementCom;