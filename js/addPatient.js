"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Element References
const fullName = document.getElementById("fullName");
const phone = document.getElementById("phone");
const gender = document.getElementById("gender");
const dateOfBirth = document.getElementById("dateOfBirth");
const urlParams = new URLSearchParams(window.location.search);
const patientId = urlParams.get('id');
// Back Button
const back = document.getElementById("back");
if (back) {
    back.innerHTML = `
        <a href="dashboard.html">عودة</a>
    `;
}
else {
    console.error("Element with ID 'back' not found.");
}
// Add Patient Button Event
const addPatientBtn = document.getElementById("patient_form");
if (addPatientBtn) {
    addPatientBtn.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
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
                    const response = yield savePatient(info);
                    if (response) {
                        alert("تم حفظ المريض");
                        location.href = `dashboard.html?id=${patientId}`;
                    }
                }
                catch (error) {
                    console.error('Error saving patient:', error);
                    alert("حدث خطأ ما");
                }
            }
            else {
                console.error('Token is missing.');
                alert("Token مفقود");
            }
        }
        else {
            console.error('Form elements are missing.');
            alert("تأكد من ملء جميع الحقول");
        }
    }));
}
// Save Patient Function
const savePatient = (info) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const token = sessionStorage.getItem('token');
        if (!token)
            throw new Error('Token is missing.');
        const response = yield fetch("http://localhost:8080/api/patients", {
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
        console.log('Patient saved successfully:', yield response.json());
        return response;
    }
    catch (error) {
        console.error('Error saving patient:', error);
    }
});
// Decode JWT
function decodeJWT(token) {
    const arr = token.split('.');
    return {
        header: JSON.parse(atob(arr[0])),
        payload: JSON.parse(atob(arr[1])),
        signature: arr[2]
    };
}
// Modal Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('patientModal');
    const btn = document.getElementById('openModalBtn');
    const span = document.getElementsByClassName('close')[0];
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
    }
    else {
        console.error("Modal or button elements not found.");
    }
});
//# sourceMappingURL=addPatient.js.map