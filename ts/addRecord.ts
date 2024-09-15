document.addEventListener("DOMContentLoaded", function () {


    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    const form = document.getElementById("patientForm") as HTMLFormElement | null;

    // استخراج id من token
    function decodeJWT(string: any) {
        var arr = string.split('.');
        return { header: JSON.parse(atob(arr[0])), payload: JSON.parse(atob(arr[1])), secret: arr[2] }
    }
    if (form) {
        form.addEventListener("submit", async function (event) {
            event.preventDefault();
            const token = sessionStorage.getItem('token');

            const id = decodeJWT(token).payload.sub

            const formData: FormData = new FormData(form);
            const recordDateValue = formData.get("recordDate");

            if (!recordDateValue || !patientId || !id) {
                console.error('Required fields are missing');
                alert('Please fill in all required fields.');
                return;
            }

            const postData = {
                recordDate: new Date(recordDateValue.toString()).toISOString(),
                notes: formData.get("notes"),
                patient: {
                    patientID: patientId
                },
                doctor: {
                    "doctorID": id
                }
            };
            try {

                const response = await fetch("http://localhost:8080/api/medicalRecords", {
                    method: "POST",
                    body: JSON.stringify(postData),
                    headers: { "content-type": "application/json", 'Authorization': `Bearer ${token}` },
                })
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                const urlParams = new URLSearchParams(window.location.search);
                const Id = urlParams.get('id');
                const data = await response.json();
                console.log('Patient saved successfully:', data);
                alert('save successful');
                console.log(Id)
                location.href = `patient.html?id=${Id}`;
            } catch (error) {
                console.error('Error saving patient:', error);
                alert('save faild');
            }

        });
    }

});
