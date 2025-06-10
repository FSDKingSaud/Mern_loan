 // add more lenders field
  const addMoreLenders = () => {
    const extraLender = document.getElementById("extraDetails");

    const div = document.createElement("div");
    div.className = "row mb-3";

    const label = document.createElement("label");
    label.className = "col-form-label col-4 mt-2";
    label.innerHTML = "Name of Lender";
    const label2 = document.createElement("label");
    label2.className = "col-form-label col-4 mt-2";
    label2.innerHTML = "Monthly Deductions";

    const lenderName = document.createElement("input");
    lenderName.type = "text";
    lenderName.className = "form-control lenderName";
    const deduction = document.createElement("input");
    deduction.type = "text";
    deduction.className = "form-control lenderDeduction";

    const ddiv1 = document.createElement("div");
    ddiv1.className = "row mb-3";
    const ddiv = document.createElement("div");
    ddiv.className = "col-8";
    ddiv.appendChild(deduction);
    ddiv1.appendChild(label2);
    ddiv1.appendChild(ddiv);

    const div2 = document.createElement("div");
    div2.className = "col-8";
    div2.appendChild(lenderName);
    div.appendChild(label);
    div.appendChild(div2);
    extraLender.appendChild(div);
    extraLender.appendChild(ddiv1);
   
};
  
export default addMoreLenders;