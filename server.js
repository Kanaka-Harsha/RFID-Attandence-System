let attendanceData = [];

async function fetchAttendance() 
{
    try 
    {
        let response = await fetch("http://Your_IP_Address:3000/attendance");
        let data = await response.json();
        attendanceData = data.sort((a, b) => a.roll_number.localeCompare(b.roll_number)); // Sort by roll number
        renderTable(attendanceData);
        updateAttendanceSummary(attendanceData);
    } 
    catch (error) 
    {
        console.error("Error fetching data:", error);
    }
}

function renderTable(data) 
{
    let tableBody = document.getElementById("attendance-body");
    tableBody.innerHTML = "";
    data.forEach(student => {
        let attendancePercentage = parseFloat(student.attendance_percentage) || 0;

        let row = `<tr>
            <td>${student.roll_number}</td>
            <td>${student.name}</td>
            <td>${student.rfid_uid}</td>
            <td>30</td>
            <td>${student.attendance_count}</td>
            <td>${attendancePercentage.toFixed(2)}%</td>
        </tr>`;
        tableBody.innerHTML += row;
    });
}

function updateAttendanceSummary(data) 
{
    let totalAttendance = 0;
    data.forEach(student => {
        totalAttendance += parseFloat(student.attendance_percentage) || 0;
    });
    let avgAttendance = (totalAttendance / data.length).toFixed(2);

    let summaryDiv = document.getElementById("attendance-summary");
    summaryDiv.innerHTML = `
        <p><strong>Total IoT Students:</strong> ${data.length}</p>
        <p><strong>Average IoT Attendance:</strong> ${avgAttendance}%</p>
    `;
}

function searchTable() 
{
    let input = document.getElementById("search").value.toLowerCase();
    let filteredData = attendanceData.filter(student =>
        student.roll_number.toLowerCase().includes(input) ||
        student.name.toLowerCase().includes(input) ||
        student.rfid_uid.toLowerCase().includes(input)
    );
    renderTable(filteredData);
    updateAttendanceSummary(filteredData);
}


window.onload = () => {
fetchAttendance();
startDataRefresh(5);
};
