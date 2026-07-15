const fs = require("fs");

const deptsTeams = {
  Engineering: ["Frontend", "Backend", "QA", "DevOps", "UI/UX"],
  Marketing: ["Content", "SEO", "Social Media"],
  Design: ["Product Design", "Research", "Brand"],
  Finance: ["Accounts", "Payroll", "Audit"],
  HR: ["Recruitment", "Operations", "Culture"],
  Sales: ["Inbound", "Outbound", "Enterprise"],
  Product: ["Strategy", "Roadmap", "Analytics"],
};

function assignTeam(content) {
  return content.replace(
    /department:\s*['\"]([^'\"]+)['\"]/g,
    (match, deptName) => {
      const teams = deptsTeams[deptName] || ["Core"];
      const randomTeam = teams[Math.floor(Math.random() * teams.length)];
      return match + ',\n    team: "' + randomTeam + '"';
    },
  );
}

const mockDataPath =
  "d:/EMS Admin/Employment-Management-System/src/app/data/mockData.ts";
let mockData = fs.readFileSync(mockDataPath, "utf8");
fs.writeFileSync(mockDataPath, assignTeam(mockData));

const empDirPath =
  "d:/EMS Admin/Employment-Management-System/src/app/pages/employee/EmployeeDirectory.tsx";
let empDir = fs.readFileSync(empDirPath, "utf8");
fs.writeFileSync(empDirPath, assignTeam(empDir));
console.log("Done");
