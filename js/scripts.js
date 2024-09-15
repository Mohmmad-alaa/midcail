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
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    const email = document.getElementById("username");
    const password = document.getElementById("password");
    if (loginForm) {
        loginForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
            e.preventDefault();
            // معالجة تسجيل الدخول هنا
            if (email && password) {
                try {
                    const response = (yield fetch(`http://localhost:8080/api/doctors/login?email=${email.value}&password=${password.value}`)).json();
                    let data = yield response;
                    console.log(data);
                    if (data) {
                        location.href = `dashboard.html?id=${data.doctorID}`;
                    }
                }
                catch (error) {
                    console.error('email and password is wrong:', error);
                }
            }
        }));
    }
    // استخراج id من token
    function decodeJWT(token) {
        const arr = token.split('.');
        return {
            header: JSON.parse(atob(arr[0])),
            payload: JSON.parse(atob(arr[1])),
            signature: arr[2]
        };
    }
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            // معالجة إنشاء الحساب هنا
        });
    }
    // جلب المرضى من قاعدة البيانات
    let divPatients = document.querySelector(".patients");
    if (divPatients) {
        function getpatients() {
            return __awaiter(this, void 0, void 0, function* () {
                const token = sessionStorage.getItem('token');
                const secret = 'secretkeynew';
                if (token) {
                    const id = decodeJWT(token).payload.sub;
                    console.log(token);
                    console.log(id);
                    //const urlParams = new URLSearchParams(window.location.search);
                    //const patientId = urlParams.get('id');
                    let data = (yield fetch(`http://localhost:8080/api/patients/byDoctor/${id}`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    })).json();
                    console.log(yield data);
                    addPatientToPage(yield data);
                }
            });
        }
        getpatients();
        // عرض المرضى في الصفحة الرئيسية
        function addPatientToPage(patients) {
            patients.forEach(e => {
                let tr = document.createElement("tr");
                tr.id = `${e.patientID}`;
                tr.innerHTML = `
                    <td data-label="رقم الهاتف">${e.phone}</td>
                    <td data-label="الاسم">${e.fullName}</td>
                    <td data-label="التفاصيل"><a href="patient.html?id=${e.patientID}">تفاصيل المريض</a></td>
                    <td data-label="حذف"> <span class="delete" id="${e.patientID}">
                        حذف
                    </span>
                    <span class="update" id="${e.patientID}">
                        تعديل
                    </span> </td>
                    `;
                if (divPatients) {
                    divPatients.appendChild(tr);
                }
                // divPatients.appendChild(tr);
            });
        }
    }
    // حذف المريض من قاعدة البيانات
    document.addEventListener("click", (e) => {
        //e.preventDefault();
        const target = e.target;
        if (target.className === "delete") {
            if (confirm("هل انت متأكد من حذف المريض")) {
                deletePatients();
                function deletePatients() {
                    return __awaiter(this, void 0, void 0, function* () {
                        var _a;
                        const token = sessionStorage.getItem('token');
                        try {
                            let data = (yield fetch(`http://localhost:8080/api/patients/${target.id}`, {
                                method: "Delete",
                                headers: { 'Authorization': `Bearer ${token}` }
                            }));
                            (_a = document.getElementById(`${target.id}`)) === null || _a === void 0 ? void 0 : _a.remove();
                        }
                        catch (e) {
                            console.error(e);
                        }
                    });
                }
            }
        }
        if (target.className === "update") {
            location.href = `updatePatient.html?id=${target.id}`;
        }
    });
    //
    const addPatientBtn = document.getElementById("addPatientBtn");
    if (addPatientBtn) {
        addPatientBtn.addEventListener("click", () => {
            // معالجة إضافة مريض جديد هنا
            const urlParams = new URLSearchParams(window.location.search);
            const patientId = urlParams.get('id');
            location.href = `formPatient.html`;
        });
    }
    const addRecordBtn = document.getElementById("addRecordBtn");
    if (addRecordBtn) {
        addRecordBtn.addEventListener("click", () => {
            // معالجة إضافة سجل طبي جديد هنا
        });
    }
});
let divDelete = document.getElementById("delete");
if (divDelete) {
    console.log("divDelete");
}
//# sourceMappingURL=scripts.js.map