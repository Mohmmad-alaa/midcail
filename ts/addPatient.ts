// Element References
const fullName = document.getElementById("fullName") as HTMLInputElement | null;
const phone = document.getElementById("phone") as HTMLInputElement | null;
const gender = document.getElementById("gender") as HTMLSelectElement | null;
const dateOfBirth = document.getElementById("dateOfBirth") as HTMLInputElement | null;

const urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.get('id');

// Back Button
const back = document.getElementById("back") as HTMLDivElement | null;
if (back) {
    back.innerHTML = `
        <a href="dashboard.html">عودة</a>
    `;
} else {
    console.error("Element with ID 'back' not found.");
}

// Add Patient Button Event
const addPatientBtn = document.getElementById("patient_form") as HTMLFormElement | null;
if (addPatientBtn) {
    addPatientBtn.addEventListener("submit", async (e) => {
        e.preventDefault();

        if (fullName && phone && gender && dateOfBirth) {
            const token = sessionStorage.getItem('token');
            if (token) {
                const id = decodeJWT(token).payload.sub;
                const info = {
                    fullName: fullName.value,
                    phone: phone.value,
                    gender: gender.value,
                    dateOfBirth: dateOfBirth.value,
                    doctor: {
                        doctorID: id
                    }
                };

                try {
                    const response = await savePatient(info);
                    if (response) {
                        alert("تم حفظ المريض");
                        location.href = `dashboard.html?id=${patientId}`;
                    }
                } catch (error) {
                    console.error('Error saving patient:', error);
                    alert("حدث خطأ ما");
                }
            } else {
                console.error('Token is missing.');
                alert("Token مفقود");
            }
        } else {
            console.error('Form elements are missing.');
            alert("تأكد من ملء جميع الحقول");
        }
    });
}

// Save Patient Function
const savePatient = async (info: object): Promise<Response | undefined> => {
    try {
        const token = sessionStorage.getItem('token');
        if (!token) throw new Error('Token is missing.');

        const response = await fetch("http://localhost:8080/api/patients", {
            method: "POST",
            body: JSON.stringify(info),
            headers: {
                "content-type": "application/json",
                'Authorization': `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        console.log('Patient saved successfully:', await response.json());
        return response;

    } catch (error) {
        console.error('Error saving patient:', error);
    }
};

// Decode JWT
function decodeJWT(token: string) {
    const arr = token.split('.');
    return {
        header: JSON.parse(atob(arr[0])),
        payload: JSON.parse(atob(arr[1])),
        signature: arr[2]
    };
}

// Modal Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('patientModal') as HTMLDivElement | null;
    const btn = document.getElementById('openModalBtn') as HTMLButtonElement | null;
    const span = document.getElementsByClassName('close')[0] as HTMLElement;

    if (btn && modal) {
        btn.onclick = () => {
            modal.style.display = 'block';
        };

        span.onclick = () => {
            modal.style.display = 'none';
        };

        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    } else {
        console.error("Modal or button elements not found.");
    }
});
