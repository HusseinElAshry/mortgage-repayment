const setError = (inputElement, errorMessage,errorElementId)=>{    
    if (!document.getElementById(errorElementId)){
        const errorElement = document.createElement('p');
        errorElement.classList.add('error','ps-0','text-danger' , 'mt-3', 'fw-semibold' );
        errorElement.setAttribute("id", errorElementId)
        errorElement.innerHTML = errorMessage;
        inputElement.parentElement.parentElement.append(errorElement);
        if(inputElement.getAttribute('type')=='number'){
            let spanElement = inputElement.nextElementSibling;
            if(!spanElement){
                spanElement = inputElement.previousElementSibling;
            }
            spanElement.classList.add('bg-danger', 'border-danger','text-white');
            spanElement.classList.remove('bg-light-blue', 'bg-lime', 'text-slate-700');
            inputElement.classList.add('border-danger');
            inputElement.parentElement.classList.remove('border-lime', 'input-border');
        }
    }
}
const setValidInput = (inputElement,errorElementId)=>{
    const errorElement = document.getElementById(errorElementId);
    if(errorElement){
        errorElement.remove();
    }
    if(inputElement.getAttribute('type')=='number'){
        let spanElement = inputElement.nextElementSibling;
        if(!spanElement){
            spanElement = inputElement.previousElementSibling;
        }
        spanElement.classList.remove('bg-danger', 'border-danger','text-white');
        spanElement.classList.add('bg-light-blue', 'text-slate-700');
        inputElement.classList.remove('border-danger');
        inputElement.parentElement.classList.add('input-border');
    }
}
const validateMortgageAmount = (mortgageAmount)=>{
    const amountValue = Number(mortgageAmount.value);
    if(amountValue == 0){
        setError(mortgageAmount,`mortgage amount is required`,'mortgageAmountError');
        return false;
    }else if(amountValue<0){
        setError(mortgageAmount,`mortgage amount must be positive value `,'mortgageAmountError');
        return false;
    }
    setValidInput(mortgageAmount, 'mortgageAmountError')
    return true;
    
}
const validateInterstRate = (mortgageInterestRate)=>{   
    const InterestRateValue =Number(mortgageInterestRate.value);    
    if(InterestRateValue <= 0 || InterestRateValue > 100){
        setError(mortgageInterestRate,`interest rate must be less than 100 and greater than 0`,'interestRateError');
        return false;
    }else if (mortgageInterestRate.value == ''){
        setError(mortgageInterestRate,`mortgage interest rate is required`,'interestRateError');
        return false
    }
    setValidInput(mortgageInterestRate, 'interestRateError')
    return true;
    
} 
const validateMortgageTerm = (mortgageTerm)=>{
    const termValue = Number(mortgageTerm.value);
    if(termValue == 0){
        setError(mortgageTerm, `mortgage term is required and can't be 0`,'mortgageTermError');
        return false;
    }else if(termValue < 0){
        setError(mortgageTerm, `mortgage term is must be positive value`,'mortgageTermError');
        return false;
    }
    setValidInput(mortgageTerm,'mortgageTermError' )
    return true;

}
const validateMortgageType= (radioInputs)=>{
    for(let i = 0; i < radioInputs.length; i++){
        if(radioInputs[i].checked){
            setValidInput(radioInputs[0],'mortgageTypeError')
            return true;
        }
    }
    setError(radioInputs[0],'This field is required', 'mortgageTypeError');
    return false;
}
const calcRepayment = ({amount,term,interest,calcTotal}={})=>{
    let monthlyRepayment;
    let totalRepayment;
    let rToNRatio = (interest/100)/12
    monthlyRepayment = (amount*rToNRatio)/(1-((1+rToNRatio)**(-term*12)))
    if(!calcTotal){
        monthlyRepayment -=(amount/(term*12)) 
    }
    totalRepayment = monthlyRepayment*term*12;
    monthlyRepayment = Number(monthlyRepayment.toFixed(2)).toLocaleString();
    totalRepayment = Number(totalRepayment.toFixed(2)).toLocaleString();
    return {monthlyRepayment,totalRepayment}
}
const changeWorkSpace = ({amount,term,interest,calcTotal}={})=>{
    const emptyWorkSpace = document.getElementById('emptyWorkSpace');
    const calcWorkSpace =  document.getElementById('calcWorkSpace');
    const totalRepaymentElement = document.getElementById('totalRepayment');
    const monthlyRepaymentElement = document.getElementById('monthlyRepayment');
    emptyWorkSpace.classList.add('d-none');
    calcWorkSpace.classList.remove('d-none');
    const {monthlyRepayment,totalRepayment} = calcRepayment({amount,term,interest,calcTotal});
    totalRepaymentElement.innerHTML = `&pound; ${totalRepayment}`;
    monthlyRepaymentElement.innerHTML = `&pound; ${monthlyRepayment}`;
}
const clearWorkSpace = ()=>{
    const emptyWorkSpace = document.getElementById('emptyWorkSpace');
    const calcWorkSpace =  document.getElementById('calcWorkSpace');
    emptyWorkSpace.classList.remove('d-none');
    calcWorkSpace.classList.add('d-none');
}
const validateForm = (e)=>{
    e.preventDefault();
    const mortgageAmount = document.getElementById('mortgageAmountInput');
    const mortgageInterestRate = document.getElementById('InterestRateInput'); 
    const mortgageTerm = document.getElementById('mortgageTermInput');
    const radioInputs = Array.from(document.querySelectorAll(`input[type='radio']`));

    const isValidAmount = validateMortgageAmount(mortgageAmount);
    const isvalidInterest = validateInterstRate(mortgageInterestRate);
    const isValidTerm = validateMortgageTerm(mortgageTerm);
    const isValidType = validateMortgageType(radioInputs); 

    if(isValidAmount&&isvalidInterest&&isValidTerm&&isValidType){
        changeWorkSpace({
            amount:Number(mortgageAmount.value),
            interest:Number(mortgageInterestRate.value),
            term:Number(mortgageTerm.value),
            calcTotal:radioInputs[0].checked
        });
    }else{
        clearWorkSpace();
    }
}

const submitForm = ()=>{
    const form = document.getElementById('mortgageForm');
    form.addEventListener('submit', validateForm);
}
const formControlFocus = (inputElement)=>{
    return (e)=>{   
        const sibling =  inputElement.parentElement.querySelector('.input-group-text');     
        inputElement.classList.add('form-control-focus','border-lime')
        inputElement.classList.remove('border-danger')
        inputElement.parentElement.classList.add('border-lime');
        inputElement.parentElement.classList.remove('input-border');
        sibling.classList.add('bg-lime', 'text-slate-700');
        sibling.classList.remove('bg-light-blue','bg-danger', 'border-danger','text-white');
        inputElement.parentElement.nextElementSibling?.remove();
    }    
}
const formControlBlur = (inputElement)=>{
    return (e)=>{   
        const sibling =  inputElement.parentElement.querySelector('.input-group-text');
        inputElement.classList.remove('form-control-focus', 'border-lime');
        inputElement.parentElement.classList.remove('border-lime');
        inputElement.parentElement.classList.add('input-border');
        sibling.classList.remove('bg-lime');
        sibling.classList.add('bg-light-blue');
    }    
}
const formControlFocusBlur = ()=>{
    const formControls = Array.from(document.querySelectorAll(`input[type='number']`));    
    for (const formControl of formControls) {
        formControl.addEventListener('focus', formControlFocus(formControl));
        formControl.addEventListener('blur',formControlBlur(formControl));
    }
}
const formCheckInputChange = (formCheckInputs)=>{
    return (e)=>{      
        for (const formCheckInput of formCheckInputs) {
            if(formCheckInput.checked){
                formCheckInput.classList.add('form-check-input-checked');
                formCheckInput.classList.remove('form-check-input-unchecked');
                formCheckInput.parentElement.classList.add('bg-lime-with-opacity', 'border-lime'); 
            }else{
                formCheckInput.classList.remove('form-check-input-checked');
                formCheckInput.classList.add('form-check-input-unchecked');
                formCheckInput.parentElement.classList.remove('bg-lime-with-opacity', 'border-lime');
            }  
        }
        validateMortgageType(formCheckInputs);
    }
}
const formCheckInputCheckedUnChecked = ()=>{
    const formCheckInputs = Array.from(document.querySelectorAll('.form-check-input'));
    for (const formCheckInput of formCheckInputs) {
        formCheckInput.addEventListener('change',formCheckInputChange(formCheckInputs));
    }
}
const clearRadios = ()=>{
    const formCheckInputs = Array.from(document.querySelectorAll('.form-check-input'));
    for (const formCheckInput of formCheckInputs) {
        formCheckInput.checked = false;
        formCheckInput.classList.remove('form-check-input-checked');
        formCheckInput.classList.add('form-check-input-unchecked');
        formCheckInput.parentElement.classList.remove('bg-lime-with-opacity', 'border-lime');
    }
}
const clearInputs = ()=>{
    const formInputs = Array.from(document.querySelectorAll(`input[type='number']`));
    for(const formInput of formInputs){
        formInput.value = "";
    }
}
const clearForm = ()=>{
    const clearButton = document.getElementById('clearButton');
    clearButton.addEventListener('click', ()=>{
        clearInputs();
        clearRadios();
        clearWorkSpace();
    });
}


clearForm();
formControlFocusBlur();
formCheckInputCheckedUnChecked();
submitForm();



