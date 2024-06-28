// script.js
function calculateUpsell() {
    const currentPlan = parseFloat(document.getElementById('current-plan').value);
    const newPlan = parseFloat(document.getElementById('new-plan').value);
    const startDate = new Date(document.getElementById('start-date').value);
    const migrationDate = new Date(document.getElementById('migration-date').value);
    const renewalDate = new Date(startDate);
    renewalDate.setFullYear(renewalDate.getFullYear() + 1);

    const monthsUsed = (migrationDate.getFullYear() - startDate.getFullYear()) * 12 + (migrationDate.getMonth() - startDate.getMonth());
    const monthsRemaining = (renewalDate.getFullYear() - migrationDate.getFullYear()) * 12 + (renewalDate.getMonth() - migrationDate.getMonth());

    const currentMonthly = currentPlan / 12;
    const newMonthly = newPlan / 12;

    const amountUsed = currentMonthly * monthsUsed;
    const amountRemaining = currentPlan - amountUsed;

    const newPlanProportional = newMonthly * monthsRemaining;
    
    const difference = newPlanProportional - amountRemaining;

    document.getElementById('result').textContent = `Valor a ser cobrado para migração: R$${difference.toFixed(2)}`;
}
