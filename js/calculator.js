class Calculator {
    constructor() {
        this.display = document.querySelector('.calculator-display input');
        this.buttons = document.querySelectorAll('.btn');
        this.currentValue = '';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        
        this.initialize();
    }
    
    initialize() {
        this.buttons.forEach(button => {
            button.addEventListener('click', () => {
                const value = button.textContent;
                
                if (button.classList.contains('btn-number')) {
                    this.handleNumber(value);
                } else if (button.classList.contains('btn-operator')) {
                    this.handleOperator(value);
                } else if (button.classList.contains('btn-equals')) {
                    this.handleEquals();
                } else if (button.classList.contains('btn-clear')) {
                    this.handleClear();
                } else if (button.classList.contains('btn-backspace')) {
                    this.handleBackspace();
                }
            });
        });
        
        // Handle keyboard input
        document.addEventListener('keydown', (e) => {
            if (e.key >= '0' && e.key <= '9' || e.key === '.') {
                this.handleNumber(e.key);
            } else if (['+', '-', '*', '/', '%'].includes(e.key)) {
                this.handleOperator(e.key);
            } else if (e.key === '=' || e.key === 'Enter') {
                this.handleEquals();
            } else if (e.key === 'Escape') {
                this.handleClear();
            } else if (e.key === 'Backspace') {
                this.handleBackspace();
            }
        });
    }
    
    handleNumber(value) {
        if (this.shouldResetDisplay) {
            this.currentValue = '';
            this.shouldResetDisplay = false;
        }
        
        if (value === '.' && this.currentValue.includes('.')) {
            return;
        }
        
        this.currentValue += value;
        this.updateDisplay();
    }
    
    handleOperator(value) {
        if (this.operation && !this.shouldResetDisplay) {
            this.calculate();
        }
        
        this.operation = value;
        this.previousValue = this.currentValue;
        this.shouldResetDisplay = true;
    }
    
    handleEquals() {
        if (!this.operation) return;
        
        this.calculate();
        this.operation = null;
    }
    
    handleClear() {
        this.currentValue = '';
        this.previousValue = '';
        this.operation = null;
        this.shouldResetDisplay = false;
        this.updateDisplay();
    }
    
    handleBackspace() {
        this.currentValue = this.currentValue.slice(0, -1);
        this.updateDisplay();
    }
    
    calculate() {
        const prev = parseFloat(this.previousValue);
        const current = parseFloat(this.currentValue);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        let result;
        switch (this.operation) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '×':
                result = prev * current;
                break;
            case '÷':
                result = prev / current;
                break;
            case '%':
                result = prev % current;
                break;
        }
        
        this.currentValue = result.toString();
        this.updateDisplay();
    }
    
    updateDisplay() {
        this.display.value = this.currentValue || '0';
    }
}

// Initialize calculator when window loads
window.addEventListener('load', () => {
    new Calculator();
}); 