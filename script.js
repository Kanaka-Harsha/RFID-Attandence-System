let attendanceData = [];
const TOTAL_CLASSES = 60;

async function fetchAttendance() 
{
    try 
    {
        let response = await fetch("http://10.123.26.112:3000/attendance", { cache: "no-store" });
        let data = await response.json();
        attendanceData = data.sort((a, b) => a.roll_number.localeCompare(b.roll_number));
        renderTable(attendanceData);
        updateAttendanceSummary(attendanceData);
    } 
    catch (error) 
    {
        console.error("❌ Error fetching data:", error);
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
           
            <td>${TOTAL_CLASSES}</td>
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

    let avgAttendance = (totalAttendance / data.length).toFixed(2) || 0;

    let summaryDiv = document.getElementById("attendance-summary");
    summaryDiv.innerHTML = `
        <p><strong>Total IoT Students:</strong> ${data.length}</p>
        <p><strong>Total Number Of Classes:</strong> ${TOTAL_CLASSES}</p>   
        <p><strong>Average IoT Attendance:</strong> ${avgAttendance}%</p>
    `;
}

function searchTable() {
    let input = document.getElementById("search").value.toLowerCase();
    let rows = document.querySelectorAll("#attendance-body tr");

    rows.forEach(row => {
        let rollNumber = row.cells[0].innerText.toLowerCase();
        let name = row.cells[1].innerText.toLowerCase();
        if (rollNumber.includes(input) || name.includes(input)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
}



async function refreshAttendanceAfterScan() {
    setTimeout(fetchAttendance, 100);
}


setInterval(fetchAttendance, 5000);
window.onload = fetchAttendance();