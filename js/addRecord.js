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
document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const patientId = urlParams.get('id');
    const form = document.getElementById("patientForm");
    // استخراج id من token
    function decodeJWT(string) {
        var arr = string.split('.');
        return { header: JSON.parse(atob(arr[0])), payload: JSON.parse(atob(arr[1])), secret: arr[2] };
    }
    if (form) {
        form.addEventListener("submit", function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                event.preventDefault();
                const token = sessionStorage.getItem('token');
                const id = decodeJWT(token).payload.sub;
                const formData = new FormData(form);
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
                    const response = yield fetch("http://localhost:8080/api/medicalRecords", {
                        method: "POST",
                        body: JSON.stringify(postData),
                        headers: { "content-type": "application/json", 'Authorization': `Bearer ${token}` },
                    });
                    if (!response.ok) {
                        throw new Error('Network response was not ok ' + response.statusText);
                    }
                    const urlParams = new URLSearchParams(window.location.search);
                    const Id = urlParams.get('id');
                    const data = yield response.json();
                    console.log('Patient saved successfully:', data);
                    alert('save successful');
                    console.log(Id);
                    location.href = `patient.html?id=${Id}`;
                }
                catch (error) {
                    console.error('Error saving patient:', error);
                    alert('save faild');
                }
            });
        });
    }
});
//# sourceMappingURL=addRecord.js.map