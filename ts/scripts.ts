




document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;
    const email = document.getElementById("username") as HTMLFormElement | null;
    const password = document.getElementById("password") as HTMLFormElement | null;
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            // معالجة تسجيل الدخول هنا
            if (email && password) {
                try {
                    const response = (await fetch(`http://localhost:8080/api/doctors/login?email=${email.value}&password=${password.value}`)).json();
                    let data = await response;
                    console.log(data)
                    if (data) {
                        location.href = `dashboard.html?id=${data.doctorID}`;
                    }

                } catch (error) {
                    console.error('email and password is wrong:', error);
                }
            }
        });
    }
    // استخراج id من token
    function decodeJWT(token: string) {
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
    let divPatients = document.querySelector(".patients") as HTMLDivElement | null;
    if (divPatients) {
        async function getpatients() {
            const token = sessionStorage.getItem('token');
            const secret = 'secretkeynew';
            if (token) {
                const id = decodeJWT(token).payload.sub as string;

                console.log(token)
                console.log(id)
                //const urlParams = new URLSearchParams(window.location.search);
                //const patientId = urlParams.get('id');
                let data = (await fetch(`http://localhost:8080/api/patients/byDoctor/${id}`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })).json();
                console.log(await data)
                addPatientToPage(await data);
            }
        }
        getpatients();


        // عرض المرضى في الصفحة الرئيسية
        function addPatientToPage(patients: any[]) {
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
                    `; if (divPatients) {
                    divPatients.appendChild(tr);
                }
                // divPatients.appendChild(tr);
            });
        }
    }


    // حذف المريض من قاعدة البيانات

    document.addEventListener("click", (e) => {
        //e.preventDefault();
        const target = e.target as HTMLElement;
        if (target.className === "delete") {
            if (confirm("هل انت متأكد من حذف المريض")) {
                deletePatients();
                async function deletePatients() {
                    const token = sessionStorage.getItem('token');
                    try {
                        let data = (await fetch(`http://localhost:8080/api/patients/${target.id}`, {
                            method: "Delete",
                            headers: { 'Authorization': `Bearer ${token}` }
                        }));
                        document.getElementById(`${target.id}`)?.remove()

                    } catch (e) {
                        console.error(e)
                    }
                }

            }
        }

        if (target.className === "update") {

            location.href = `updatePatient.html?id=${target.id}`

        }


    });

    //
    const addPatientBtn = document.getElementById("addPatientBtn") as HTMLButtonElement | null;
    if (addPatientBtn) {
        addPatientBtn.addEventListener("click", () => {
            // معالجة إضافة مريض جديد هنا
            const urlParams = new URLSearchParams(window.location.search);
            const patientId = urlParams.get('id');
            location.href = `formPatient.html`


        });
    }

    const addRecordBtn = document.getElementById("addRecordBtn") as HTMLButtonElement | null;
    if (addRecordBtn) {
        addRecordBtn.addEventListener("click", () => {
            // معالجة إضافة سجل طبي جديد هنا
        });
    }
});





let divDelete = document.getElementById("delete");
if (divDelete) {
    console.log("divDelete")
}



