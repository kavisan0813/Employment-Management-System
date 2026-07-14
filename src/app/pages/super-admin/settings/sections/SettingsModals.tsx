import React from "react";
import { useSettingsContext } from "../SettingsContext";
import { useAuth } from "../../../../context/AuthContext";
import { Users } from "lucide-react";

export function SettingsModals() {
  const { user } = useAuth();
  const isHR = user?.role === "HR Manager";

  const {
    activeModal,
    confirmEditRoleSubmit,
    deptForm,
    deptsList,
    editForm,
    getStatusStyles,
    handlePayrollSubmit,
    handleRoleSubmit,
    holidayForm,
    holidaysList,
    inviteForm,
    isSubmitting,
    leaveTypeForm,
    leaveTypesList,
    locForm,
    locationsList,
    lpApprovalLevels,
    lpPolicyVersion,
    payrollCutoff,
    payrollCycle,
    payrollPayout,
    permissionGroups,
    prHalfDayCalc,
    prLateDeduct,
    prLopEnabled,
    prOtPay,
    prPayslipTemplate,
    prTaxMode,
    reactivateConfirm,
    roleForm,
    scheduleForm,
    schedulesList,
    selectedDept,
    selectedHoliday,
    selectedLeaveType,
    selectedLoc,
    selectedRoleForEdit,
    selectedSchedule,
    selectedUser,
    setActiveModal,
    setDeptForm,
    setDeptsList,
    setEditForm,
    setHolidayForm,
    setHolidaysList,
    setInviteForm,
    setIsSubmitting,
    setLeaveTypeForm,
    setLeaveTypesList,
    setLocForm,
    setLocationsList,
    setLpLastUpdatedBy,
    setLpLastUpdatedTime,
    setLpPolicyVersion,
    setPayrollCutoff,
    setPayrollCycle,
    setPayrollPayout,
    setPrHalfDayCalc,
    setPrLateDeduct,
    setPrLopEnabled,
    setPrOtPay,
    setPrPayslipTemplate,
    setPrTaxMode,
    setReactivateConfirm,
    setRoleForm,
    setScheduleForm,
    setSchedulesList,
    setUsersList,
    showToast,
    usersList,
  } = useSettingsContext();

  if (!activeModal) return null;

  const closeModal = () => setActiveModal(null);

  const handleScheduleSubmit = () => {
    if (!scheduleForm.name.trim()) {
      showToast("Schedule Name is required", "error");
      return;
    }
    if (!scheduleForm.code.trim()) {
      showToast("Schedule Code is required", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (activeModal === "add_schedule") {
        const newSched = {
          name: scheduleForm.name,
          code: scheduleForm.code,
          type: scheduleForm.type,
          startTime: scheduleForm.startTime,
          endTime: scheduleForm.endTime,
          breakDuration: scheduleForm.breakDuration,
          workingDays: scheduleForm.workingDays,
          weekends: scheduleForm.weekends,
          graceTime: scheduleForm.graceTime,
          halfDayRule: scheduleForm.halfDayRule,
          otEligible: scheduleForm.otEligible,
          dept: scheduleForm.dept,
          location: scheduleForm.location,
          empCount: 0,
          status: scheduleForm.status,
        };
        setSchedulesList([...schedulesList, newSched]);
        showToast("Schedule created successfully", "success");
      } else {
        setSchedulesList(
          schedulesList.map((s) =>
            s.code === selectedSchedule?.code
              ? {
                  ...s,
                  name: scheduleForm.name,
                  code: scheduleForm.code,
                  type: scheduleForm.type,
                  startTime: scheduleForm.startTime,
                  endTime: scheduleForm.endTime,
                  breakDuration: scheduleForm.breakDuration,
                  workingDays: scheduleForm.workingDays,
                  weekends: scheduleForm.weekends,
                  graceTime: scheduleForm.graceTime,
                  halfDayRule: scheduleForm.halfDayRule,
                  otEligible: scheduleForm.otEligible,
                  dept: scheduleForm.dept,
                  location: scheduleForm.location,
                  status: scheduleForm.status,
                }
              : s,
          ),
        );
        showToast("Schedule updated successfully", "success");
      }
      setIsSubmitting(false);
      closeModal();
    }, 1000);
  };

  const handleDeleteScheduleSubmit = () => {
    if (selectedSchedule && selectedSchedule.empCount > 0) {
      showToast("Cannot delete a schedule with assigned employees", "error");
      closeModal();
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setSchedulesList(
        schedulesList.filter(
          (s: { code: string }) => s.code !== selectedSchedule?.code,
        ),
      );
      setIsSubmitting(false);
      showToast("Schedule deleted successfully", "success");
      closeModal();
    }, 1000);
  };

  const handleLeaveTypeSubmit = () => {
    if (!leaveTypeForm.name.trim()) {
      showToast("Leave Type Name is required", "error");
      return;
    }
    if (!leaveTypeForm.code.trim()) {
      showToast("Leave Code is required", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (activeModal === "add_leave_type") {
        const newLT = {
          name: leaveTypeForm.name,
          code: leaveTypeForm.code,
          days: leaveTypeForm.days,
          type: leaveTypeForm.type,
          carryForward: leaveTypeForm.carryForward,
          maxCarryForward: leaveTypeForm.maxCarryForward,
          encashment: leaveTypeForm.encashment,
          approvalRequired: leaveTypeForm.approvalRequired,
          attachmentRequired: leaveTypeForm.attachmentRequired,
          minNoticePeriod: leaveTypeForm.minNoticePeriod,
          maxConsecutiveLeave: leaveTypeForm.maxConsecutiveLeave,
          dept: leaveTypeForm.dept,
          location: leaveTypeForm.location,
          status: leaveTypeForm.status,
          description: leaveTypeForm.description,
        };
        setLeaveTypesList([...leaveTypesList, newLT]);
        showToast("Leave type created successfully", "success");
      } else {
        setLeaveTypesList(
          leaveTypesList.map((l) =>
            l.code === selectedLeaveType?.code
              ? {
                  ...l,
                  name: leaveTypeForm.name,
                  code: leaveTypeForm.code,
                  days: leaveTypeForm.days,
                  type: leaveTypeForm.type,
                  carryForward: leaveTypeForm.carryForward,
                  maxCarryForward: leaveTypeForm.maxCarryForward,
                  encashment: leaveTypeForm.encashment,
                  approvalRequired: leaveTypeForm.approvalRequired,
                  attachmentRequired: leaveTypeForm.attachmentRequired,
                  minNoticePeriod: leaveTypeForm.minNoticePeriod,
                  maxConsecutiveLeave: leaveTypeForm.maxConsecutiveLeave,
                  dept: leaveTypeForm.dept,
                  location: leaveTypeForm.location,
                  status: leaveTypeForm.status,
                  description: leaveTypeForm.description,
                }
              : l,
          ),
        );
        showToast("Leave type updated successfully", "success");
      }
      setIsSubmitting(false);
      closeModal();
    }, 1000);
  };

  const handleDeleteLeaveType = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setLeaveTypesList(
        leaveTypesList.filter(
          (l: { code: string }) => l.code !== selectedLeaveType?.code,
        ),
      );
      setIsSubmitting(false);
      showToast("Leave type removed successfully", "success");
      closeModal();
    }, 1000);
  };

  const handleSaveLeavePolicy = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setLpLastUpdatedBy("Ryan Park (Super Admin)");
      const now = new Date();
      setLpLastUpdatedTime(
        `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`,
      );
      const vNum = parseFloat(lpPolicyVersion.replace("v", ""));
      setLpPolicyVersion(`v${(vNum + 0.1).toFixed(1)}`);
      setIsSubmitting(false);
      showToast("Leave policy updated successfully", "success");
      closeModal();
    }, 1500);
  };

  const handleHolidaySubmit = () => {
    if (!holidayForm.name.trim()) {
      showToast("Holiday Name is required", "error");
      return;
    }
    if (!holidayForm.date) {
      showToast("Date is required", "error");
      return;
    }

    const parsedDate = new Date(holidayForm.date);
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayName = daysOfWeek[parsedDate.getDay()];

    setIsSubmitting(true);
    setTimeout(() => {
      if (activeModal === "add_holiday") {
        const newHol = {
          name: holidayForm.name,
          date: holidayForm.date,
          day: dayName,
          type: holidayForm.type,
          location: holidayForm.location,
          dept: holidayForm.dept,
          recurring: holidayForm.recurring,
          status: holidayForm.status,
          description: holidayForm.description,
        };
        setHolidaysList([...holidaysList, newHol]);
        showToast("Holiday created successfully", "success");
      } else {
        setHolidaysList(
          holidaysList.map((h) =>
            h.date === selectedHoliday?.date && h.name === selectedHoliday?.name
              ? {
                  ...h,
                  name: holidayForm.name,
                  date: holidayForm.date,
                  day: dayName,
                  type: holidayForm.type,
                  location: holidayForm.location,
                  dept: holidayForm.dept,
                  recurring: holidayForm.recurring,
                  status: holidayForm.status,
                  description: holidayForm.description,
                }
              : h,
          ),
        );
        showToast("Holiday updated successfully", "success");
      }
      setIsSubmitting(false);
      closeModal();
    }, 1000);
  };

  const handleDeleteHolidaySubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setHolidaysList(
        holidaysList.filter(
          (h: { date: string; name: string }) =>
            !(
              h.date === selectedHoliday?.date &&
              h.name === selectedHoliday?.name
            ),
        ),
      );
      setIsSubmitting(false);
      showToast("Holiday removed successfully", "success");
      closeModal();
    }, 1000);
  };

  const handleLocSubmit = () => {
    if (!locForm.name.trim()) {
      showToast("Location Name is required", "error");
      return;
    }
    if (!locForm.code.trim()) {
      showToast("Location Code is required", "error");
      return;
    }
    if (!locForm.city.trim()) {
      showToast("City is required", "error");
      return;
    }
    if (!locForm.country.trim()) {
      showToast("Country is required", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (activeModal === "add_location") {
        const newLoc = {
          name: locForm.name,
          code: locForm.code,
          type: locForm.type,
          address: locForm.address,
          city: locForm.city,
          state: locForm.state,
          country: locForm.country,
          pincode: locForm.pincode,
          manager: locForm.manager,
          timezone: locForm.timezone,
          status: locForm.status,
          notes: locForm.notes,
          empCount: 0,
          createdDate: new Date().toISOString().split("T")[0],
        };
        setLocationsList([...locationsList, newLoc]);
        showToast("Location created successfully", "success");
      } else {
        setLocationsList(
          locationsList.map((l) =>
            l.code === selectedLoc?.code
              ? {
                  ...l,
                  name: locForm.name,
                  code: locForm.code,
                  type: locForm.type,
                  address: locForm.address,
                  city: locForm.city,
                  state: locForm.state,
                  country: locForm.country,
                  pincode: locForm.pincode,
                  manager: locForm.manager,
                  timezone: locForm.timezone,
                  status: locForm.status,
                  notes: locForm.notes,
                  lastUpdated: new Date().toISOString().split("T")[0],
                }
              : l,
          ),
        );
        showToast("Location updated successfully", "success");
      }
      setIsSubmitting(false);
      closeModal();
    }, 1000);
  };

  const handleDeleteLocSubmit = () => {
    if (selectedLoc && selectedLoc.empCount > 0) {
      showToast("Transfer employees before deleting.", "error");
      closeModal();
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setLocationsList(
        locationsList.filter(
          (l: { code: string }) => l.code !== selectedLoc?.code,
        ),
      );
      setIsSubmitting(false);
      showToast("Location deleted successfully", "success");
      closeModal();
    }, 1000);
  };

  const handleDeptSubmit = () => {
    if (!deptForm.name.trim()) {
      showToast("Department Name is required", "error");
      return;
    }
    if (!deptForm.code.trim()) {
      showToast("Department Code is required", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      if (activeModal === "add_department") {
        const newDept = {
          name: deptForm.name,
          code: deptForm.code,
          head: deptForm.head,
          status: deptForm.status,
          budget: deptForm.budget,
          description: deptForm.description,
          empCount: 0,
          createdDate: new Date().toISOString().split("T")[0],
        };
        setDeptsList([...deptsList, newDept]);
        showToast("Department created successfully", "success");
      } else {
        setDeptsList(
          deptsList.map((d) =>
            d.code === selectedDept?.code
              ? {
                  ...d,
                  name: deptForm.name,
                  code: deptForm.code,
                  head: deptForm.head,
                  status: deptForm.status,
                  budget: deptForm.budget,
                  description: deptForm.description,
                }
              : d,
          ),
        );
        showToast("Department updated successfully", "success");
      }
      setIsSubmitting(false);
      closeModal();
    }, 1000);
  };

  const handleDeleteDeptSubmit = () => {
    if (selectedDept && selectedDept.empCount > 0) {
      showToast("Transfer employees before deleting.", "error");
      closeModal();
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setDeptsList(
        deptsList.filter(
          (d: { code: string }) => d.code !== selectedDept?.code,
        ),
      );
      setIsSubmitting(false);
      showToast("Department deleted successfully", "success");
      closeModal();
    }, 1000);
  };

  const handleInviteSubmit = () => {
    if (!inviteForm.name.trim()) {
      showToast("Full Name is required", "error");
      return;
    }
    if (!inviteForm.email.trim() || !/\S+@\S+\.\S+/.test(inviteForm.email)) {
      showToast("A valid email address is required", "error");
      return;
    }
    if (!inviteForm.role) {
      showToast("Role is required", "error");
      return;
    }
    if (!inviteForm.dept) {
      showToast("Department is required", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const initials = inviteForm.name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      const newUser = {
        name: inviteForm.name,
        email: inviteForm.email,
        initials: initials || "U",
        avatarBg: "#00B87C",
        role: inviteForm.role,
        dept: inviteForm.dept,
        location: inviteForm.location || "N/A",
        lastLogin: "Never",
        status: "Pending Invite",
      };

      setUsersList([...usersList, newUser]);
      setIsSubmitting(false);
      showToast("Invitation sent successfully", "success");
      setInviteForm({
        name: "",
        email: "",
        role: "Employee",
        dept: "Engineering",
        location: "",
        sendEmail: true,
        tempPassword: "",
        notes: "",
      });
      closeModal();
    }, 1000);
  };

  const handleEditSubmit = () => {
    if (!editForm.name.trim()) {
      showToast("Full Name is required", "error");
      return;
    }
    if (!editForm.email.trim() || !/\S+@\S+\.\S+/.test(editForm.email)) {
      showToast("A valid email address is required", "error");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setUsersList(
        usersList.map((u) =>
          u.email === selectedUser?.email
            ? {
                ...u,
                name: editForm.name,
                email: editForm.email,
                role: editForm.role,
                dept: editForm.dept,
                location: editForm.location,
                status: editForm.status,
              }
            : u,
        ),
      );
      setIsSubmitting(false);
      showToast("User updated successfully", "success");
      closeModal();
    }, 1000);
  };

  const handleReactivateSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setUsersList(
        usersList.map((u) =>
          u.email === selectedUser?.email ? { ...u, status: "Active" } : u,
        ),
      );
      setIsSubmitting(false);
      showToast("User reactivated successfully", "success");
      closeModal();
    }, 1000);
  };

  const handleDeactivateSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setUsersList(
        usersList.map((u) =>
          u.email === selectedUser?.email ? { ...u, status: "Inactive" } : u,
        ),
      );
      setIsSubmitting(false);
      showToast("User deactivated successfully", "success");
      closeModal();
    }, 1000);
  };

  if (activeModal === "add_leave_type" || activeModal === "edit_leave_type") {
    const isEdit = activeModal === "edit_leave_type";
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-xl rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              {isEdit ? "Edit Leave Type" : "Add Leave Type"}
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Leave Type Name *
                </label>
                <input
                  type="text"
                  value={leaveTypeForm.name}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Leave Code *
                </label>
                <input
                  type="text"
                  value={leaveTypeForm.code}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      code: e.target.value,
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Annual Entitlement (Days) *
                </label>
                <input
                  type="number"
                  value={leaveTypeForm.days}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      days: parseInt(e.target.value),
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Type
                </label>
                <select
                  value={leaveTypeForm.type}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      type: e.target.value as "Paid" | "Unpaid",
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="Paid">Paid</option>
                  <option value="Unpaid">Unpaid</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="cfAllowed"
                  checked={leaveTypeForm.carryForward}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      carryForward: e.target.checked,
                    })
                  }
                  className="rounded accent-[#00B87C]"
                />
                <label
                  htmlFor="cfAllowed"
                  style={{
                    fontSize: "13px",
                    color: "var(--foreground)",
                    fontWeight: 500,
                  }}
                >
                  Carry Forward Allowed
                </label>
              </div>
              {leaveTypeForm.carryForward && (
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Max Carry Forward Days
                  </label>
                  <input
                    type="number"
                    value={leaveTypeForm.maxCarryForward}
                    onChange={(e) =>
                      setLeaveTypeForm({
                        ...leaveTypeForm,
                        maxCarryForward: parseInt(e.target.value),
                      })
                    }
                    className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                    style={{
                      backgroundColor: "var(--input-background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 py-2">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="encAllowed"
                  checked={leaveTypeForm.encashment}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      encashment: e.target.checked,
                    })
                  }
                  className="rounded accent-[#00B87C]"
                />
                <label
                  htmlFor="encAllowed"
                  style={{
                    fontSize: "13px",
                    color: "var(--foreground)",
                    fontWeight: 500,
                  }}
                >
                  Encashment Allowed
                </label>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="appReq"
                  checked={leaveTypeForm.approvalRequired}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      approvalRequired: e.target.checked,
                    })
                  }
                  className="rounded accent-[#00B87C]"
                />
                <label
                  htmlFor="appReq"
                  style={{
                    fontSize: "13px",
                    color: "var(--foreground)",
                    fontWeight: 500,
                  }}
                >
                  Approval Required
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="attReq"
                  checked={leaveTypeForm.attachmentRequired}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      attachmentRequired: e.target.checked,
                    })
                  }
                  className="rounded accent-[#00B87C]"
                />
                <label
                  htmlFor="attReq"
                  style={{
                    fontSize: "13px",
                    color: "var(--foreground)",
                    fontWeight: 500,
                  }}
                >
                  Attachment Required
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Min Notice Period (Days)
                </label>
                <input
                  type="number"
                  value={leaveTypeForm.minNoticePeriod}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      minNoticePeriod: parseInt(e.target.value),
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Max Consecutive Leave (Days)
                </label>
                <input
                  type="number"
                  value={leaveTypeForm.maxConsecutiveLeave}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      maxConsecutiveLeave: parseInt(e.target.value),
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Applicable Departments
                </label>
                <select
                  value={leaveTypeForm.dept}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      dept: e.target.value,
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="HR">HR</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Applicable Locations
                </label>
                <select
                  value={leaveTypeForm.location}
                  onChange={(e) =>
                    setLeaveTypeForm({
                      ...leaveTypeForm,
                      location: e.target.value,
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="All Locations">All Locations</option>
                  <option value="Bengaluru HQ">Bengaluru HQ</option>
                  <option value="Mumbai Branch">Mumbai Branch</option>
                </select>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Status
              </label>
              <select
                value={leaveTypeForm.status}
                onChange={(e) =>
                  setLeaveTypeForm({
                    ...leaveTypeForm,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer transition-all"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleLeaveTypeSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
              style={{
                backgroundColor: "#00B87C",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Leave Type"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "delete_leave_type") {
    const isUsed =
      selectedLeaveType?.code === "CL" || selectedLeaveType?.code === "SL";
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#EF4444",
                margin: 0,
              }}
            >
              Delete Leave Type?
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--foreground)",
              margin: "0 0 12px 0",
            }}
          >
            Are you sure you want to delete{" "}
            <span className="font-bold">{selectedLeaveType?.name}</span>?
          </p>
          {isUsed && (
            <div
              className="p-3 rounded-xl mb-4 text-xs font-medium"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                color: "#D97706",
                border: "1px solid rgba(245, 158, 11, 0.2)",
              }}
            >
              ⚠️ This leave type is already used in employee records. Consider
              deactivating instead of deleting.
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteLeaveType}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
              style={{
                backgroundColor: "#EF4444",
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              {isSubmitting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "edit_payroll") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Edit Payroll Settings
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>

          <div className="mb-6 space-y-6">
            {/* TAB 1: PAY CYCLE */}
            <div
              className="border-b pb-4"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="block text-xs font-bold text-[#00B87C] uppercase mb-3">
                Payroll Cycle
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Pay Frequency
                  </label>
                  <select
                    value={payrollCycle}
                    onChange={(e) => setPayrollCycle(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-sm border"
                    style={{
                      backgroundColor: "var(--input-background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Weekly">Weekly</option>
                    <option value="Biweekly">Biweekly</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Cutoff Date
                  </label>
                  <input
                    type="text"
                    value={payrollCutoff}
                    onChange={(e) => setPayrollCutoff(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-sm border"
                    style={{
                      backgroundColor: "var(--input-background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Payout Date
                  </label>
                  <input
                    type="text"
                    value={payrollPayout}
                    onChange={(e) => setPayrollPayout(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-sm border"
                    style={{
                      backgroundColor: "var(--input-background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* TAB 2: ATTENDANCE RULES */}
            <div
              className="border-b pb-4"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="block text-xs font-bold text-[#00B87C] uppercase mb-3">
                Attendance Integration Rules
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--muted)",
                    borderColor: "var(--border)",
                  }}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Enable LOP Deduction
                  </span>
                  <input
                    type="checkbox"
                    checked={prLopEnabled}
                    onChange={(e) => setPrLopEnabled(e.target.checked)}
                    className="rounded accent-[#00B87C]"
                  />
                </div>
                <div
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--muted)",
                    borderColor: "var(--border)",
                  }}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Overtime Pay Enabled
                  </span>
                  <input
                    type="checkbox"
                    checked={prOtPay}
                    onChange={(e) => setPrOtPay(e.target.checked)}
                    className="rounded accent-[#00B87C]"
                  />
                </div>
                <div
                  className="flex items-center justify-between p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--muted)",
                    borderColor: "var(--border)",
                  }}
                >
                  <span
                    className="text-xs font-semibold"
                    style={{ color: "var(--foreground)" }}
                  >
                    Late Deduction Toggle
                  </span>
                  <input
                    type="checkbox"
                    checked={prLateDeduct}
                    onChange={(e) => setPrLateDeduct(e.target.checked)}
                    className="rounded accent-[#00B87C]"
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Half-day calculation
                  </label>
                  <select
                    value={prHalfDayCalc}
                    onChange={(e) => setPrHalfDayCalc(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-sm border"
                    style={{
                      backgroundColor: "var(--input-background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <option value="Under 4 hours">Under 4 hours</option>
                    <option value="Under 3.5 hours">Under 3.5 hours</option>
                  </select>
                </div>
              </div>
            </div>

            {/* TAB 3: PAYSLIP & COMPLIANCE */}
            <div>
              <span className="block text-xs font-bold text-[#00B87C] uppercase mb-3">
                Payslip & Compliance
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Payslip Template
                  </label>
                  <select
                    value={prPayslipTemplate}
                    onChange={(e) => setPrPayslipTemplate(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-sm border"
                    style={{
                      backgroundColor: "var(--input-background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <option value="Classic Green">Classic Green</option>
                    <option value="Modern Blue">Modern Blue</option>
                  </select>
                </div>
                <div>
                  <label
                    style={{
                      display: "block",
                      fontSize: "11px",
                      fontWeight: 700,
                      color: "var(--muted-foreground)",
                      textTransform: "uppercase",
                      marginBottom: "6px",
                    }}
                  >
                    Tax Mode
                  </label>
                  <select
                    value={prTaxMode}
                    onChange={(e) => setPrTaxMode(e.target.value)}
                    className="w-full rounded-xl px-3 py-2 text-sm border"
                    style={{
                      backgroundColor: "var(--input-background)",
                      borderColor: "var(--border)",
                      color: "var(--foreground)",
                    }}
                  >
                    <option value="New Regime (Default)">
                      New Regime (Default)
                    </option>
                    <option value="Old Regime">Old Regime</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div
            className="flex justify-end gap-3 pt-4 border-t"
            style={{ borderColor: "var(--border)" }}
          >
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={() => setActiveModal("confirm_save_payroll")}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer"
              style={{ backgroundColor: "#00B87C" }}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "confirm_save_payroll") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Confirm Payroll Changes
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              margin: "0 0 16px 0",
            }}
          >
            These changes may affect future payroll calculations and employee
            payslips.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setActiveModal("edit_payroll")}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handlePayrollSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
              style={{
                backgroundColor: "#00B87C",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? "Saving..." : "Confirm Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "confirm_save_policy") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Confirm Policy Changes
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              margin: "0 0 16px 0",
            }}
          >
            These changes may affect employee leave balances, approval
            workflows, and future leave requests.
          </p>

          <div
            className="space-y-3 mb-6 p-4 rounded-xl border"
            style={{
              backgroundColor: "var(--muted)",
              borderColor: "var(--border)",
            }}
          >
            <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
              Summary of changes
            </span>
            <div
              className="text-xs space-y-1 font-semibold"
              style={{ color: "var(--foreground)" }}
            >
              <div>• Updated active Leave Types list</div>
              <div>• Altered entitlement parameters & validations</div>
              <div>• Revised approval workflows ({lpApprovalLevels} Level)</div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleSaveLeavePolicy}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
              style={{
                backgroundColor: "#00B87C",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting ? "Saving..." : "Confirm Save"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "add_holiday" || activeModal === "edit_holiday") {
    const isEdit = activeModal === "edit_holiday";
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              {isEdit ? "Edit Holiday" : "Add Holiday"}
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <div className="mb-6 space-y-4">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Holiday Name *
              </label>
              <input
                type="text"
                value={holidayForm.name}
                onChange={(e) =>
                  setHolidayForm({ ...holidayForm, name: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Date *
                </label>
                <input
                  type="date"
                  value={holidayForm.date}
                  onChange={(e) =>
                    setHolidayForm({ ...holidayForm, date: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Holiday Type
                </label>
                <select
                  value={holidayForm.type}
                  onChange={(e) =>
                    setHolidayForm({
                      ...holidayForm,
                      type: e.target.value as
                        | "National"
                        | "Company"
                        | "Optional"
                        | "Regional"
                        | "Festival",
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="National">National</option>
                  <option value="Company">Company</option>
                  <option value="Optional">Optional</option>
                  <option value="Regional">Regional</option>
                  <option value="Festival">Festival</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Location Access
                </label>
                <select
                  value={holidayForm.location}
                  onChange={(e) =>
                    setHolidayForm({
                      ...holidayForm,
                      location: e.target.value,
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="All Locations">Global (All Locations)</option>
                  <option value="Bengaluru HQ">Bengaluru HQ</option>
                  <option value="Mumbai Branch">Mumbai Branch</option>
                  <option value="Delhi Warehouse">Delhi Warehouse</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Department Access
                </label>
                <select
                  value={holidayForm.dept}
                  onChange={(e) =>
                    setHolidayForm({ ...holidayForm, dept: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="HR">HR</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="recHol"
                checked={holidayForm.recurring}
                onChange={(e) =>
                  setHolidayForm({
                    ...holidayForm,
                    recurring: e.target.checked,
                  })
                }
                className="rounded accent-[#00B87C]"
              />
              <label
                htmlFor="recHol"
                style={{
                  fontSize: "13px",
                  color: "var(--foreground)",
                  fontWeight: 500,
                }}
              >
                Recurring Yearly
              </label>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Description
              </label>
              <textarea
                value={holidayForm.description}
                onChange={(e) =>
                  setHolidayForm({
                    ...holidayForm,
                    description: e.target.value,
                  })
                }
                rows={3}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  resize: "none",
                }}
              />
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Status
              </label>
              <select
                value={holidayForm.status}
                onChange={(e) =>
                  setHolidayForm({
                    ...holidayForm,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer transition-all"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleHolidaySubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
              style={{
                backgroundColor: "#00B87C",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Holiday"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "delete_holiday") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#EF4444",
                margin: 0,
              }}
            >
              Delete Holiday?
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--foreground)",
              margin: "0 0 16px 0",
            }}
          >
            Are you sure you want to delete the holiday{" "}
            <span className="font-bold">{selectedHoliday?.name}</span>?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteHolidaySubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
              style={{
                backgroundColor: "#EF4444",
                opacity: isSubmitting ? 0.5 : 1,
              }}
            >
              {isSubmitting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "view_holiday") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                {selectedHoliday?.name}
              </h3>
              <span
                style={{
                  backgroundColor: "rgba(0, 184, 124, 0.1)",
                  color: "#00B87C",
                  padding: "4px 8px",
                  borderRadius: "8px",
                  fontSize: "11px",
                  fontWeight: 700,
                  display: "inline-block",
                  marginTop: "6px",
                }}
              >
                {selectedHoliday?.type}
              </span>
            </div>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                border: "none",
                background: "none",
              }}
            >
              &times;
            </button>
          </div>
          <div className="space-y-4 mb-6">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: "var(--muted)",
                borderColor: "var(--border)",
              }}
            >
              <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                Date & Day
              </span>
              <span
                className="font-semibold text-sm block mt-1"
                style={{ color: "var(--foreground)" }}
              >
                {selectedHoliday?.date} ({selectedHoliday?.day})
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Location
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedHoliday?.location}
                </span>
              </div>
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Department
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedHoliday?.dept}
                </span>
              </div>
            </div>
            {selectedHoliday?.description && (
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Description
                </span>
                <p
                  className="text-sm mt-1 font-medium"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedHoliday.description}
                </p>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="px-6 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
              style={{ backgroundColor: "#00B87C" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "add_schedule" || activeModal === "edit_schedule") {
    const isEdit = activeModal === "edit_schedule";
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-2xl rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              {isEdit ? "Edit Work Schedule" : "Add Work Schedule"}
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Schedule Name *
                </label>
                <input
                  type="text"
                  value={scheduleForm.name}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, name: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Schedule Code *
                </label>
                <input
                  type="text"
                  value={scheduleForm.code}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Schedule Type
                </label>
                <select
                  value={scheduleForm.type}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      type: e.target.value as
                        | "General"
                        | "Shift"
                        | "Flexible"
                        | "Rotational"
                        | "Part Time",
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="General">General</option>
                  <option value="Shift">Shift</option>
                  <option value="Flexible">Flexible</option>
                  <option value="Rotational">Rotational</option>
                  <option value="Part Time">Part Time</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Break Duration (mins)
                </label>
                <input
                  type="number"
                  value={scheduleForm.breakDuration}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      breakDuration: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Start Time
                </label>
                <input
                  type="text"
                  value={scheduleForm.startTime}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      startTime: e.target.value,
                    })
                  }
                  placeholder="09:00"
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  End Time
                </label>
                <input
                  type="text"
                  value={scheduleForm.endTime}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      endTime: e.target.value,
                    })
                  }
                  placeholder="18:00"
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Working Days
              </label>
              <div className="flex flex-wrap gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                  (day) => {
                    const isSelected = scheduleForm.workingDays.includes(day);
                    return (
                      <button
                        key={day}
                        type="button"
                        onClick={() => {
                          const next = isSelected
                            ? scheduleForm.workingDays.filter(
                                (d: string) => d !== day,
                              )
                            : [...scheduleForm.workingDays, day];
                          setScheduleForm({
                            ...scheduleForm,
                            workingDays: next,
                          });
                        }}
                        className="px-3 py-1 text-xs font-semibold rounded-lg border transition-all"
                        style={{
                          backgroundColor: isSelected
                            ? "rgba(0, 184, 124, 0.1)"
                            : "transparent",
                          borderColor: isSelected ? "#00B87C" : "var(--border)",
                          color: isSelected ? "#00B87C" : "var(--foreground)",
                        }}
                      >
                        {day}
                      </button>
                    );
                  },
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Grace Time (mins)
                </label>
                <input
                  type="number"
                  value={scheduleForm.graceTime}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      graceTime: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Half-Day Rule
                </label>
                <input
                  type="text"
                  value={scheduleForm.halfDayRule}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      halfDayRule: e.target.value,
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Department Assignment
                </label>
                <select
                  value={scheduleForm.dept}
                  onChange={(e) =>
                    setScheduleForm({ ...scheduleForm, dept: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="All">All Departments</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Operations">Operations</option>
                  <option value="Customer Support">Customer Support</option>
                  <option value="HR">HR</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Location Assignment
                </label>
                <select
                  value={scheduleForm.location}
                  onChange={(e) =>
                    setScheduleForm({
                      ...scheduleForm,
                      location: e.target.value,
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="All">All Locations</option>
                  <option value="Bengaluru HQ">Bengaluru HQ</option>
                  <option value="Mumbai Branch">Mumbai Branch</option>
                  <option value="US Remote">US Remote</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 py-2">
              <input
                type="checkbox"
                id="otEligible"
                checked={scheduleForm.otEligible}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    otEligible: e.target.checked,
                  })
                }
                className="rounded accent-[#00B87C]"
              />
              <label
                htmlFor="otEligible"
                style={{
                  fontSize: "13px",
                  color: "var(--foreground)",
                  fontWeight: 500,
                }}
              >
                Overtime Eligible Schedule
              </label>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Status
              </label>
              <select
                value={scheduleForm.status}
                onChange={(e) =>
                  setScheduleForm({
                    ...scheduleForm,
                    status: e.target.value as "Active" | "Inactive",
                  })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer transition-all"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleScheduleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
              style={{
                backgroundColor: "#00B87C",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Schedule"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "delete_schedule") {
    const hasEmployees = selectedSchedule
      ? selectedSchedule.empCount > 0
      : false;
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#EF4444",
                margin: 0,
              }}
            >
              Delete Schedule?
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--foreground)",
              margin: "0 0 16px 0",
            }}
          >
            Are you sure you want to delete the{" "}
            <span className="font-bold">{selectedSchedule?.name}</span>{" "}
            constraint rule?
          </p>
          {hasEmployees && (
            <div
              className="p-4 rounded-xl mb-6 text-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#EF4444",
              }}
            >
              <span className="font-bold block mb-1">Warning:</span> Currently
              assigned to {selectedSchedule?.empCount} employees.
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteScheduleSubmit}
              disabled={isSubmitting || hasEmployees}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
              style={{
                backgroundColor: "#EF4444",
                opacity: isSubmitting || hasEmployees ? 0.5 : 1,
              }}
            >
              {isSubmitting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "view_schedule") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[85vh] overflow-y-auto"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                {selectedSchedule?.name}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  margin: 0,
                }}
              >
                Code: {selectedSchedule?.code} | Type: {selectedSchedule?.type}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
              }}
            >
              &times;
            </button>
          </div>

          <div className="space-y-6 mb-6">
            <div
              className="p-4 rounded-xl border grid grid-cols-2 gap-4"
              style={{
                backgroundColor: "var(--muted)",
                borderColor: "var(--border)",
              }}
            >
              <div>
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Timings
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedSchedule?.startTime === "Flexible"
                    ? "Flexible Hours"
                    : `${selectedSchedule?.startTime} - ${selectedSchedule?.endTime}`}
                </span>
              </div>
              <div>
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Break Duration
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedSchedule?.breakDuration} minutes
                </span>
              </div>
            </div>

            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: "var(--muted)",
                borderColor: "var(--border)",
              }}
            >
              <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                Working Days
              </span>
              <p
                className="text-sm mt-1 font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {selectedSchedule?.workingDays.join(", ")}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Grace Period
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedSchedule?.graceTime} mins
                </span>
              </div>
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Overtime Status
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{
                    color: selectedSchedule?.otEligible ? "#00B87C" : "#6B7280",
                  }}
                >
                  {selectedSchedule?.otEligible ? "Eligible" : "Not Eligible"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Assigned Department
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedSchedule?.dept}
                </span>
              </div>
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Location Access
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedSchedule?.location}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="px-6 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
              style={{ backgroundColor: "#00B87C" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "add_location" || activeModal === "edit_location") {
    const isEdit = activeModal === "edit_location";
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[90vh] overflow-y-auto"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              {isEdit ? "Edit Location" : "Add Location"}
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <div className="mb-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Location Name *
                </label>
                <input
                  type="text"
                  value={locForm.name}
                  onChange={(e) => {
                    const newName = e.target.value;
                    let newCode = locForm.code;
                    if (
                      !isEdit &&
                      (!locForm.code ||
                        locForm.code === locForm.name.slice(0, 3).toUpperCase())
                    ) {
                      newCode = newName.slice(0, 3).toUpperCase();
                    }
                    setLocForm({ ...locForm, name: newName, code: newCode });
                  }}
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Location Code *
                </label>
                <input
                  type="text"
                  value={locForm.code}
                  onChange={(e) =>
                    setLocForm({
                      ...locForm,
                      code: e.target.value.toUpperCase(),
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Location Type
                </label>
                <select
                  value={locForm.type}
                  onChange={(e) =>
                    setLocForm({
                      ...locForm,
                      type: e.target.value as
                        | "Head Office"
                        | "Branch"
                        | "Warehouse"
                        | "Remote",
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="Head Office">Head Office</option>
                  <option value="Branch">Branch</option>
                  <option value="Warehouse">Warehouse</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Location Manager
                </label>
                <select
                  value={locForm.manager}
                  onChange={(e) =>
                    setLocForm({ ...locForm, manager: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="">Select Manager</option>
                  <option value="Suresh Iyer">Suresh Iyer</option>
                  <option value="Vikram Singh">Vikram Singh</option>
                  <option value="Meera Thomas">Meera Thomas</option>
                  <option value="Ananya Das">Ananya Das</option>
                  <option value="Rahul Sharma">Rahul Sharma</option>
                </select>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Address
              </label>
              <input
                type="text"
                value={locForm.address}
                onChange={(e) =>
                  setLocForm({ ...locForm, address: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  City *
                </label>
                <input
                  type="text"
                  value={locForm.city}
                  onChange={(e) =>
                    setLocForm({ ...locForm, city: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  State
                </label>
                <input
                  type="text"
                  value={locForm.state}
                  onChange={(e) =>
                    setLocForm({ ...locForm, state: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Country *
                </label>
                <input
                  type="text"
                  value={locForm.country}
                  onChange={(e) =>
                    setLocForm({ ...locForm, country: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Pincode
                </label>
                <input
                  type="text"
                  value={locForm.pincode}
                  onChange={(e) =>
                    setLocForm({ ...locForm, pincode: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Timezone
                </label>
                <select
                  value={locForm.timezone}
                  onChange={(e) =>
                    setLocForm({ ...locForm, timezone: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                  <option value="PST (UTC-8)">PST (UTC-8)</option>
                  <option value="EST (UTC-5)">EST (UTC-5)</option>
                  <option value="GMT (UTC+0)">GMT (UTC+0)</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Status
                </label>
                <select
                  value={locForm.status}
                  onChange={(e) =>
                    setLocForm({
                      ...locForm,
                      status: e.target.value as
                        | "Active"
                        | "Inactive"
                        | "Partial",
                    })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>
            </div>

            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Notes
              </label>
              <textarea
                value={locForm.notes}
                onChange={(e) =>
                  setLocForm({ ...locForm, notes: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2 text-sm outline-none border transition-all resize-none h-20"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleLocSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
              style={{
                backgroundColor: "#00B87C",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Location"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "delete_location") {
    const hasEmployees = selectedLoc ? selectedLoc.empCount > 0 : false;
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#EF4444",
                margin: 0,
              }}
            >
              Delete Location?
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--foreground)",
              margin: "0 0 16px 0",
            }}
          >
            Are you sure you want to delete the{" "}
            <span className="font-bold">{selectedLoc?.name}</span> location
            asset?
          </p>
          {hasEmployees && (
            <div
              className="p-4 rounded-xl mb-6 text-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#EF4444",
              }}
            >
              <span className="font-bold block mb-1">Warning:</span> Transfer
              employees before deleting. (Current: {selectedLoc?.empCount}{" "}
              Employees)
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteLocSubmit}
              disabled={isSubmitting || hasEmployees}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
              style={{
                backgroundColor: "#EF4444",
                opacity: isSubmitting || hasEmployees ? 0.5 : 1,
              }}
            >
              {isSubmitting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "view_location") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[85vh] overflow-y-auto"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                {selectedLoc?.name}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  margin: 0,
                }}
              >
                Code: {selectedLoc?.code} | Type: {selectedLoc?.type}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
              }}
            >
              &times;
            </button>
          </div>

          <div className="space-y-6 mb-6">
            <div
              className="p-4 rounded-xl border"
              style={{
                backgroundColor: "var(--muted)",
                borderColor: "var(--border)",
              }}
            >
              <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                Full Address
              </span>
              <p
                className="text-sm mt-1 font-medium"
                style={{ color: "var(--foreground)" }}
              >
                {selectedLoc?.address}, {selectedLoc?.city},{" "}
                {selectedLoc?.state}, {selectedLoc?.country} -{" "}
                {selectedLoc?.pincode}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Location Manager
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedLoc?.manager || "Not Assigned"}
                </span>
              </div>
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Timezone
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedLoc?.timezone}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Assigned Employees
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "#00B87C" }}
                >
                  {selectedLoc?.empCount} People
                </span>
              </div>
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Created Date
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedLoc?.createdDate}
                </span>
              </div>
            </div>

            {selectedLoc?.notes && (
              <div>
                <h4
                  style={{
                    fontSize: "12px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  Notes
                </h4>
                <p
                  className="text-sm p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--input-background)",
                    color: "var(--foreground)",
                    borderColor: "var(--border)",
                  }}
                >
                  {selectedLoc.notes}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="px-6 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
              style={{ backgroundColor: "#00B87C" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "add_department" || activeModal === "edit_department") {
    const isEdit = activeModal === "edit_department";
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              {isEdit ? "Edit Department" : "Add Department"}
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <div className="mb-6 space-y-4">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Department Name *
              </label>
              <input
                type="text"
                value={deptForm.name}
                onChange={(e) => {
                  const newName = e.target.value;
                  let newCode = deptForm.code;
                  if (
                    !isEdit &&
                    (!deptForm.code ||
                      deptForm.code === deptForm.name.slice(0, 2).toUpperCase())
                  ) {
                    newCode = newName.slice(0, 2).toUpperCase();
                  }
                  setDeptForm({ ...deptForm, name: newName, code: newCode });
                }}
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Department Code *
              </label>
              <input
                type="text"
                value={deptForm.code}
                onChange={(e) =>
                  setDeptForm({
                    ...deptForm,
                    code: e.target.value.toUpperCase(),
                  })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Department Head
              </label>
              <select
                value={deptForm.head}
                onChange={(e) =>
                  setDeptForm({ ...deptForm, head: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="">Select Head (Optional)</option>
                <option value="Suresh Iyer">Suresh Iyer</option>
                <option value="Vikram Singh">Vikram Singh</option>
                <option value="Meera Thomas">Meera Thomas</option>
                <option value="Ananya Das">Ananya Das</option>
                <option value="Priya Nair">Priya Nair</option>
                <option value="Sneha Patel">Sneha Patel</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Status
              </label>
              <select
                value={deptForm.status}
                onChange={(e) =>
                  setDeptForm({ ...deptForm, status: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Budget (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. ₹50L"
                value={deptForm.budget}
                onChange={(e) =>
                  setDeptForm({ ...deptForm, budget: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Description
              </label>
              <textarea
                value={deptForm.description}
                onChange={(e) =>
                  setDeptForm({ ...deptForm, description: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2 text-sm outline-none border transition-all resize-none h-20"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border transition-all cursor-pointer"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeptSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
              style={{
                backgroundColor: "#00B87C",
                opacity: isSubmitting ? 0.6 : 1,
              }}
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                  ? "Save Changes"
                  : "Create Department"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "delete_department") {
    const hasEmployees = selectedDept ? selectedDept.empCount > 0 : false;

    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "#EF4444",
                margin: 0,
              }}
            >
              Delete Department?
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <p
            style={{
              fontSize: "14px",
              color: "var(--foreground)",
              margin: "0 0 16px 0",
            }}
          >
            Are you sure you want to delete the{" "}
            <span className="font-bold">{selectedDept?.name}</span> department?
          </p>
          {hasEmployees && (
            <div
              className="p-4 rounded-xl mb-6 text-sm"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                color: "#EF4444",
              }}
            >
              <span className="font-bold block mb-1">Warning:</span> Transfer
              employees before deleting. (Current: {selectedDept?.empCount}{" "}
              Employees)
            </div>
          )}
          <div className="flex justify-end gap-3">
            <button
              onClick={closeModal}
              className="px-4 py-2 text-sm font-bold rounded-xl border cursor-pointer"
              style={{
                backgroundColor: "transparent",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteDeptSubmit}
              disabled={isSubmitting || hasEmployees}
              className="px-4 py-2 text-sm font-bold rounded-xl text-white transition-all cursor-pointer"
              style={{
                backgroundColor: "#EF4444",
                opacity: isSubmitting || hasEmployees ? 0.5 : 1,
              }}
            >
              {isSubmitting ? "Deleting..." : "Confirm Delete"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "view_department") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-lg rounded-2xl p-6 shadow-2xl border border-[var(--border)] max-h-[85vh] overflow-y-auto"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3
                style={{
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  margin: 0,
                }}
              >
                {selectedDept?.name}
              </h3>
              <p
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  margin: 0,
                }}
              >
                Code: {selectedDept?.code} | Created on:{" "}
                {selectedDept?.createdDate}
              </p>
            </div>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
              }}
            >
              &times;
            </button>
          </div>

          <div className="space-y-6 mb-6">
            <div className="grid grid-cols-2 gap-4">
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Department Head
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedDept?.head || "Not Assigned"}
                </span>
              </div>
              <div
                className="p-4 rounded-xl border"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span className="block text-[11px] font-bold text-var(--muted-foreground) uppercase">
                  Budget allocation
                </span>
                <span
                  className="font-semibold text-sm block mt-1"
                  style={{ color: "var(--foreground)" }}
                >
                  {selectedDept?.budget || "None"}
                </span>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Description
              </h4>
              <p
                className="text-sm p-3 rounded-xl border"
                style={{
                  backgroundColor: "var(--input-background)",
                  color: "var(--foreground)",
                  borderColor: "var(--border)",
                }}
              >
                {selectedDept?.description ||
                  "No description available for this department."}
              </p>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Attendance Summary
              </h4>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div
                  className="p-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: "rgba(16, 185, 129, 0.1)",
                    color: "#10B981",
                    fontWeight: 700,
                  }}
                >
                  94% Present
                </div>
                <div
                  className="p-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: "rgba(245, 158, 11, 0.1)",
                    color: "#F59E0B",
                    fontWeight: 700,
                  }}
                >
                  4% Late
                </div>
                <div
                  className="p-2 rounded-lg text-xs"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.1)",
                    color: "#EF4444",
                    fontWeight: 700,
                  }}
                >
                  2% Absent
                </div>
              </div>
            </div>

            <div>
              <h4
                style={{
                  fontSize: "12px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "8px",
                }}
              >
                Performance Metrics
              </h4>
              <div
                className="p-3 rounded-xl border flex justify-between items-center"
                style={{
                  backgroundColor: "var(--muted)",
                  borderColor: "var(--border)",
                }}
              >
                <span
                  style={{
                    fontSize: "13px",
                    color: "var(--foreground)",
                    fontWeight: 600,
                  }}
                >
                  Average Performance Rating
                </span>
                <span
                  className="text-white text-xs font-bold px-2 py-1 rounded-lg"
                  style={{ backgroundColor: "#00B87C" }}
                >
                  4.2 / 5.0
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              onClick={closeModal}
              className="px-6 py-2 text-sm font-bold rounded-xl text-white cursor-pointer transition-all"
              style={{ backgroundColor: "#00B87C" }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "invite_user") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Invite New User
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <div className="mb-6 space-y-4">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                value={inviteForm.name}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, name: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                placeholder="First Last"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Email Address *
              </label>
              <input
                type="email"
                value={inviteForm.email}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, email: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                placeholder="name@nexushr.com"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Role *
                </label>
                <select
                  disabled={isHR}
                  value={isHR ? "Employee" : inviteForm.role}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, role: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all disabled:bg-muted disabled:opacity-75 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Manager">Manager</option>
                  <option value="Finance">Finance</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Department *
                </label>
                <select
                  value={inviteForm.dept}
                  onChange={(e) =>
                    setInviteForm({ ...inviteForm, dept: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="HR">HR</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Location (Optional)
              </label>
              <select
                value={inviteForm.location}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, location: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="">Select Location</option>
                <option value="New York">New York</option>
                <option value="London">London</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Delhi">Delhi</option>
                <option value="Chicago">Chicago</option>
                <option value="Austin">Austin</option>
              </select>
            </div>
            <div className="flex items-center gap-3 select-none mt-2">
              <div
                onClick={() =>
                  setInviteForm({
                    ...inviteForm,
                    sendEmail: !inviteForm.sendEmail,
                  })
                }
                className="w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer"
                style={{
                  backgroundColor: inviteForm.sendEmail
                    ? "#00B87C"
                    : "transparent",
                  borderColor: inviteForm.sendEmail
                    ? "#00B87C"
                    : "var(--border)",
                }}
              >
                {inviteForm.sendEmail && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 5"
                    />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--foreground)",
                  fontWeight: 500,
                }}
              >
                Send invitation email
              </span>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Temporary Password (Optional)
              </label>
              <input
                type="password"
                value={inviteForm.tempPassword}
                onChange={(e) =>
                  setInviteForm({
                    ...inviteForm,
                    tempPassword: e.target.value,
                  })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                placeholder="••••••••"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Notes (Optional)
              </label>
              <textarea
                value={inviteForm.notes}
                onChange={(e) =>
                  setInviteForm({ ...inviteForm, notes: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                  height: "60px",
                  resize: "none",
                }}
                placeholder="Additional context..."
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: "none",
                backgroundColor: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleInviteSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              style={{ border: "none", backgroundColor: "#00B87C" }}
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "edit_user") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Edit User
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <div className="mb-6 space-y-4">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Full Name *
              </label>
              <input
                type="text"
                value={editForm.name}
                onChange={(e) =>
                  setEditForm({ ...editForm, name: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Email Address *
              </label>
              <input
                type="email"
                value={editForm.email}
                onChange={(e) =>
                  setEditForm({ ...editForm, email: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Role
                </label>
                <select
                  disabled={isHR}
                  value={editForm.role}
                  onChange={(e) =>
                    setEditForm({ ...editForm, role: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all disabled:bg-muted disabled:opacity-75 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="HR Manager">HR Manager</option>
                  <option value="Manager">Manager</option>
                  <option value="Finance">Finance</option>
                  <option value="Employee">Employee</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Department
                </label>
                <select
                  value={editForm.dept}
                  onChange={(e) =>
                    setEditForm({ ...editForm, dept: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="HR">HR</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Finance">Finance</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Location
                </label>
                <select
                  value={editForm.location}
                  onChange={(e) =>
                    setEditForm({ ...editForm, location: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="">Select Location</option>
                  <option value="New York">New York</option>
                  <option value="London">London</option>
                  <option value="Bangalore">Bangalore</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Chicago">Chicago</option>
                  <option value="Austin">Austin</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                    marginBottom: "6px",
                  }}
                >
                  Status
                </label>
                <select
                  disabled={isHR}
                  value={editForm.status}
                  onChange={(e) =>
                    setEditForm({ ...editForm, status: e.target.value })
                  }
                  className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all disabled:bg-muted disabled:opacity-75 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: "var(--input-background)",
                    borderColor: "var(--border)",
                    color: "var(--foreground)",
                  }}
                >
                  <option value="Active">Active</option>
                  <option value="Pending Invite">Pending Invite</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Permissions (Optional)
              </label>
              <input
                type="text"
                value={editForm.permissions}
                onChange={(e) =>
                  setEditForm({ ...editForm, permissions: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                placeholder="e.g. View-only Reports"
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: "none",
                backgroundColor: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleEditSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              style={{ border: "none", backgroundColor: "#00B87C" }}
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "reactivate_user") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Reactivate User
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <div className="mb-6 space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: "var(--input-background)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                {selectedUser?.name}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  marginTop: "2px",
                }}
              >
                {selectedUser?.email}
              </span>
              <div className="flex items-center gap-2 mt-3">
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: "var(--muted-foreground)",
                    textTransform: "uppercase",
                  }}
                >
                  Current Status:
                </span>
                <span
                  style={{
                    backgroundColor: selectedUser
                      ? getStatusStyles(selectedUser.status).bg
                      : "transparent",
                    color: selectedUser
                      ? getStatusStyles(selectedUser.status).color
                      : "transparent",
                    padding: "2px 8px",
                    borderRadius: "8px",
                    fontSize: "10px",
                    fontWeight: 700,
                  }}
                >
                  {selectedUser?.status}
                </span>
              </div>
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "var(--muted-foreground)",
                margin: 0,
              }}
            >
              This user will regain access to the EMS system.
            </p>

            <div className="flex items-center gap-3 select-none mt-2">
              <div
                onClick={() =>
                  setReactivateConfirm({
                    ...reactivateConfirm,
                    sendEmail: !reactivateConfirm.sendEmail,
                  })
                }
                className="w-5 h-5 rounded flex items-center justify-center border transition-all cursor-pointer"
                style={{
                  backgroundColor: reactivateConfirm.sendEmail
                    ? "#00B87C"
                    : "transparent",
                  borderColor: reactivateConfirm.sendEmail
                    ? "#00B87C"
                    : "var(--border)",
                }}
              >
                {reactivateConfirm.sendEmail && (
                  <svg
                    className="w-3 h-3 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 5"
                    />
                  </svg>
                )}
              </div>
              <span
                style={{
                  fontSize: "13px",
                  color: "var(--foreground)",
                  fontWeight: 500,
                }}
              >
                Send reactivation email
              </span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: "none",
                backgroundColor: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleReactivateSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              style={{ border: "none", backgroundColor: "#00B87C" }}
            >
              {isSubmitting ? "Reactivating..." : "Reactivate User"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (activeModal === "deactivate_user") {
    return (
      <div
        className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
      >
        <div
          className="w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[var(--border)]"
          style={{ backgroundColor: "var(--card)" }}
        >
          <div className="flex justify-between items-start mb-4">
            <h3
              style={{
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--foreground)",
                margin: 0,
              }}
            >
              Deactivate User
            </h3>
            <button
              onClick={closeModal}
              className="text-2xl hover:opacity-70 transition-all cursor-pointer"
              style={{
                color: "var(--muted-foreground)",
                background: "none",
                border: "none",
                lineHeight: 1,
              }}
            >
              &times;
            </button>
          </div>
          <div className="mb-6 space-y-4">
            <div
              className="p-4 rounded-xl"
              style={{
                backgroundColor: "var(--input-background)",
                border: "1px solid var(--border)",
              }}
            >
              <span
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                }}
              >
                {selectedUser?.name}
              </span>
              <span
                style={{
                  display: "block",
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  marginTop: "2px",
                }}
              >
                {selectedUser?.email}
              </span>
            </div>

            <p
              style={{
                fontSize: "13px",
                color: "#EF4444",
                fontWeight: 600,
                margin: 0,
              }}
            >
              This user will lose access to the EMS system.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={closeModal}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                border: "none",
                backgroundColor: "var(--muted)",
                color: "var(--muted-foreground)",
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDeactivateSubmit}
              disabled={isSubmitting}
              className="w-full sm:w-auto px-4 py-2.5 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
              style={{ border: "none", backgroundColor: "#EF4444" }}
            >
              {isSubmitting ? "Deactivating..." : "Deactivate User"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  let title: string;
  let content: React.ReactNode;

  switch (activeModal) {
    case "add_schedule":
    case "edit_schedule":
      title =
        activeModal === "add_schedule"
          ? "Add Work Schedule"
          : "Edit Work Schedule";
      content = (
        <div className="space-y-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Schedule Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              placeholder="e.g. Standard 5-Day"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Working Days
              </label>
              <input
                type="text"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                placeholder="Mon–Fri"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Hours/Day
              </label>
              <input
                type="text"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                placeholder="8h"
              />
            </div>
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Shift Time
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              placeholder="09:00–18:00"
            />
          </div>
        </div>
      );
      break;
    case "add_leave_type":
    case "edit_leave_type":
      title =
        activeModal === "add_leave_type" ? "Add Leave Type" : "Edit Leave Type";
      content = (
        <div className="space-y-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Leave Type Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              placeholder="e.g. Sick Leave"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Days per Year
              </label>
              <input
                type="text"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                placeholder="12"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Accrual
              </label>
              <select
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option>Monthly</option>
                <option>Yearly</option>
                <option>One-time</option>
              </select>
            </div>
          </div>
        </div>
      );
      break;
    case "reset_defaults":
      title = "Reset to Defaults";
      content = (
        <p
          style={{
            fontSize: "13px",
            color: "var(--muted-foreground)",
            margin: 0,
          }}
        >
          Are you absolutely sure you want to reset all configurations back to
          factory defaults? This action cannot be undone.
        </p>
      );
      break;
    case "add_payroll_component":
    case "edit_payroll_component":
      title =
        activeModal === "add_payroll_component"
          ? "Add Payroll Component"
          : "Edit Payroll Component";
      content = (
        <div className="space-y-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Component Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Type
              </label>
              <select
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option>Fixed</option>
                <option>Variable</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Taxable
              </label>
              <select
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option>Yes</option>
                <option>No</option>
                <option>Partial</option>
              </select>
            </div>
          </div>
        </div>
      );
      break;
    case "add_holiday":
      title = "Add Holiday Event";
      content = (
        <div className="space-y-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Holiday Label
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              placeholder="e.g. Diwali"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Date
              </label>
              <input
                type="date"
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Category
              </label>
              <select
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option>National</option>
                <option>Regional</option>
                <option>Company</option>
              </select>
            </div>
          </div>
        </div>
      );
      break;
    case "remove_holiday":
    case "delete_role":
    case "revoke_api_key":
    case "delete_webhook":
      title = "Delete Configuration";
      content = (
        <p
          style={{
            fontSize: "13px",
            color: "var(--muted-foreground)",
            margin: 0,
          }}
        >
          This destructive action will permanently purge the target parameter.
          Continue?
        </p>
      );
      break;
    case "add_department":
    case "edit_department":
      title =
        activeModal === "add_department"
          ? "Provision Department"
          : "Update Department";
      content = (
        <div className="space-y-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Department Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Lead Entity
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>
      );
      break;
    case "add_location":
    case "edit_location":
      title =
        activeModal === "add_location"
          ? "Provision Office Cluster"
          : "Update Office Coordinates";
      content = (
        <div className="space-y-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Site Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Timezone Designation
            </label>
            <input
              type="text"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
          </div>
        </div>
      );
      break;
    case "create_role":
    case "edit_role":
      title = activeModal === "create_role" ? "Create Role" : "Edit Role";
      content = (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Role Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={roleForm.name}
                onChange={(e) =>
                  setRoleForm({ ...roleForm, name: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all focus:border-[var(--primary)]"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
                placeholder="e.g. HR Administrator"
              />
            </div>
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "11px",
                  fontWeight: 700,
                  color: "var(--muted-foreground)",
                  textTransform: "uppercase",
                  marginBottom: "6px",
                }}
              >
                Status
              </label>
              <select
                value={roleForm.status}
                onChange={(e) =>
                  setRoleForm({ ...roleForm, status: e.target.value })
                }
                className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all focus:border-[var(--primary)]"
                style={{
                  backgroundColor: "var(--input-background)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Description
            </label>
            <textarea
              value={roleForm.description}
              onChange={(e) =>
                setRoleForm({ ...roleForm, description: e.target.value })
              }
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all focus:border-[var(--primary)] resize-none"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
                minHeight: "80px",
              }}
              placeholder="Describe the responsibilities of this role..."
            />
          </div>

          {activeModal === "edit_role" && selectedRoleForEdit && (
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: "var(--muted)" }}
            >
              <Users size={14} style={{ color: "var(--muted-foreground)" }} />
              <span
                style={{
                  fontSize: "12px",
                  color: "var(--muted-foreground)",
                  fontWeight: 500,
                }}
              >
                Assigned to{" "}
                <strong style={{ color: "var(--foreground)" }}>
                  {selectedRoleForEdit.members}
                </strong>{" "}
                users
              </span>
            </div>
          )}

          <div>
            <div className="flex items-center justify-between mb-4">
              <label
                style={{
                  display: "block",
                  fontSize: "13px",
                  fontWeight: 700,
                  color: "var(--foreground)",
                  textTransform: "none",
                }}
              >
                Module Permissions
              </label>
              <button
                onClick={() => {
                  const newPerms = { ...roleForm.permissions };
                  Object.keys(newPerms).forEach((k) => (newPerms[k] = "no"));
                  setRoleForm({ ...roleForm, permissions: newPerms });
                }}
                className="text-[12px] font-semibold hover:underline transition-colors"
                style={{
                  color: "var(--muted-foreground)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Clear All
              </button>
            </div>

            <div
              className="border rounded-xl overflow-hidden"
              style={{
                borderColor: "var(--border)",
                maxHeight: "40vh",
                overflowY: "auto",
              }}
            >
              <table className="w-full text-left border-collapse relative">
                <thead
                  className="sticky top-0 z-10"
                  style={{ backgroundColor: "var(--muted)" }}
                >
                  <tr>
                    <th
                      className="py-3 px-4 text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: "var(--muted-foreground)" }}
                    >
                      Module
                    </th>
                    <th
                      className="py-3 px-2 text-center text-[11px] font-bold uppercase tracking-wider"
                      style={{
                        color: "var(--muted-foreground)",
                        width: "60px",
                      }}
                    >
                      View
                    </th>
                    <th
                      className="py-3 px-2 text-center text-[11px] font-bold uppercase tracking-wider"
                      style={{
                        color: "var(--muted-foreground)",
                        width: "60px",
                      }}
                    >
                      Create
                    </th>
                    <th
                      className="py-3 px-2 text-center text-[11px] font-bold uppercase tracking-wider"
                      style={{
                        color: "var(--muted-foreground)",
                        width: "60px",
                      }}
                    >
                      Edit
                    </th>
                    <th
                      className="py-3 px-2 text-center text-[11px] font-bold uppercase tracking-wider"
                      style={{
                        color: "var(--muted-foreground)",
                        width: "60px",
                      }}
                    >
                      Delete
                    </th>
                    <th
                      className="py-3 px-4 text-right text-[11px] font-bold uppercase tracking-wider"
                      style={{
                        color: "var(--muted-foreground)",
                        width: "90px",
                      }}
                    >
                      Select All
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {permissionGroups.map(
                    (group: {
                      id: React.Key | null | undefined;
                      name:
                        | string
                        | number
                        | boolean
                        | React.ReactElement<
                            string,
                            string | React.JSXElementConstructor<string>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Iterable<React.ReactNode>
                        | null
                        | undefined;
                      modules: { id: string; name: string }[];
                    }) => (
                      <React.Fragment key={group.id}>
                        <tr>
                          <td
                            colSpan={6}
                            className="px-4 py-2 text-[12px] font-bold"
                            style={{
                              backgroundColor: "var(--card)",
                              color: "var(--foreground)",
                              borderTop: "1px solid var(--border)",
                              borderBottom: "1px solid var(--border)",
                            }}
                          >
                            {group.name}
                          </td>
                        </tr>
                        {group.modules.map((mod) => {
                          const p = roleForm.permissions[mod.id] || "no";
                          const isView = p === "view" || p === "full";
                          const isFull = p === "full";

                          const handleCheck = (
                            type: string,
                            checked: boolean,
                          ) => {
                            let next = p;
                            if (type === "view") {
                              next = checked ? "view" : "no";
                            } else if (type === "full") {
                              next = checked ? "full" : "view";
                            }
                            setRoleForm((prev) => ({
                              ...prev,
                              permissions: {
                                ...prev.permissions,
                                [mod.id]: next,
                              },
                            }));
                          };

                          return (
                            <tr
                              key={mod.id}
                              className="hover:bg-[var(--muted)] transition-colors"
                              style={{
                                borderBottom: "1px solid var(--border)",
                              }}
                            >
                              <td
                                className="px-4 py-3 text-[13px] font-medium"
                                style={{ color: "var(--foreground)" }}
                              >
                                {mod.name}
                              </td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={isView}
                                  onChange={(e) =>
                                    handleCheck("view", e.target.checked)
                                  }
                                  className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] cursor-pointer"
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={isFull}
                                  onChange={(e) =>
                                    handleCheck("full", e.target.checked)
                                  }
                                  disabled={!isView}
                                  className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] disabled:opacity-50 cursor-pointer"
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={isFull}
                                  onChange={(e) =>
                                    handleCheck("full", e.target.checked)
                                  }
                                  disabled={!isView}
                                  className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] disabled:opacity-50 cursor-pointer"
                                />
                              </td>
                              <td className="text-center">
                                <input
                                  type="checkbox"
                                  checked={isFull}
                                  onChange={(e) =>
                                    handleCheck("full", e.target.checked)
                                  }
                                  disabled={!isView}
                                  className="w-4 h-4 rounded border-gray-300 text-[var(--primary)] focus:ring-[var(--primary)] disabled:opacity-50 cursor-pointer"
                                />
                              </td>
                              <td className="text-right px-4">
                                <button
                                  onClick={() => handleCheck("full", !isFull)}
                                  className="text-[11px] font-semibold transition-colors"
                                  style={{
                                    color: isFull
                                      ? "#00B87C"
                                      : "var(--muted-foreground)",
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                  }}
                                >
                                  {isFull ? "Selected" : "Select All"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </React.Fragment>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      );
      break;
    case "confirm_edit_role":
      title = "Confirm Permission Changes";
      content = (
        <div className="space-y-4">
          <p
            style={{
              fontSize: "14px",
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            Changes to this role may affect users assigned to it.
          </p>
        </div>
      );
      break;
    case "invite_user":
    case "edit_user":
      title =
        activeModal === "invite_user"
          ? "Invite Authorized Specialist"
          : "Adjust User Authority";
      content = (
        <div className="space-y-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Email Credentials
            </label>
            <input
              type="email"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              placeholder="name@nexushr.com"
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Authorization Level
            </label>
            <select
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            >
              <option>Super Admin</option>
              <option>HR Manager</option>
              <option>Manager</option>
              <option>Employee</option>
            </select>
          </div>
        </div>
      );
      break;
    case "manage_integration":
      title = "Manage Application Synchronization";
      content = (
        <div className="space-y-4">
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Configure API mappings securely for this enterprise integration
            flow.
          </p>
        </div>
      );
      break;
    case "generate_api_key":
      title = "Issue Cryptographic API Tokens";
      content = (
        <div className="space-y-4">
          <p
            style={{
              fontSize: "13px",
              color: "var(--muted-foreground)",
              margin: 0,
            }}
          >
            Generate secure background access keys granting immediate server
            verification.
          </p>
        </div>
      );
      break;
    case "add_webhook":
    case "edit_webhook":
      title =
        activeModal === "add_webhook"
          ? "Hook Service Callback"
          : "Modify Callback Bindings";
      content = (
        <div className="space-y-4">
          <div>
            <label
              style={{
                display: "block",
                fontSize: "11px",
                fontWeight: 700,
                color: "var(--muted-foreground)",
                textTransform: "uppercase",
                marginBottom: "6px",
              }}
            >
              Target End-point URL
            </label>
            <input
              type="url"
              className="w-full rounded-xl px-3 py-2.5 text-sm outline-none border transition-all"
              style={{
                backgroundColor: "var(--input-background)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
              placeholder="https://"
            />
          </div>
        </div>
      );
      break;
    default:
      return null;
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center p-4 z-[2000]"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div
        className={`w-full ${activeModal === "create_role" || activeModal === "edit_role" ? "max-w-2xl" : "max-w-md"} rounded-2xl p-6 shadow-2xl border border-[var(--border)] relative`}
        style={{
          backgroundColor: "var(--card)",
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div className="flex justify-between items-start mb-4">
          <h3
            style={{
              fontSize: "16px",
              fontWeight: 700,
              color: "var(--foreground)",
              margin: 0,
            }}
          >
            {title}
          </h3>
          <button
            onClick={closeModal}
            className="text-2xl hover:opacity-70 transition-all cursor-pointer"
            style={{
              color: "var(--muted-foreground)",
              background: "none",
              border: "none",
              lineHeight: 1,
            }}
          >
            &times;
          </button>
        </div>
        <div className="mb-6 overflow-y-auto pr-2" style={{ flexGrow: 1 }}>
          {content}
        </div>
        <div className="flex justify-end gap-3 flex-wrap mt-auto pt-4 border-t border-[var(--border)]">
          <button
            onClick={closeModal}
            className="px-4 py-2 text-sm font-semibold rounded-xl transition-all cursor-pointer w-full sm:w-auto"
            style={{
              border: "none",
              backgroundColor: "var(--muted)",
              color: "var(--muted-foreground)",
            }}
          >
            Cancel
          </button>
          {activeModal === "create_role" || activeModal === "edit_role" ? (
            <button
              onClick={handleRoleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 w-full sm:w-auto"
              style={{ border: "none", backgroundColor: "#00B87C" }}
            >
              {isSubmitting
                ? "Processing..."
                : activeModal === "create_role"
                  ? "Create Role"
                  : "Save Changes"}
            </button>
          ) : activeModal === "confirm_edit_role" ? (
            <button
              onClick={confirmEditRoleSubmit}
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer disabled:opacity-50 w-full sm:w-auto"
              style={{ border: "none", backgroundColor: "#00B87C" }}
            >
              {isSubmitting ? "Processing..." : "Confirm Save"}
            </button>
          ) : (
            <button
              onClick={() => {
                showToast("Parameters updated successfully");
                closeModal();
              }}
              className="px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all cursor-pointer w-full sm:w-auto"
              style={{ border: "none", backgroundColor: "#00B87C" }}
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
