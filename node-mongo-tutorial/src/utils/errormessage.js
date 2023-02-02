export default function errorMessage(word) {
    const obj = {
        'string.base': `${word} is Invalid`,
        'string.empty': `${word} cannot be an empty field`,
        'string.min': `${word} should have at least {#limit} characters`,
        'any.required': `${word} is required `,
        'any.invalid': `${word} is Invalid`,
        'object.regex': `Must have at least 8 characters`,
        'string.pattern.base': `${word} must have 8 characters, Uppercase and Lowercase, a number and a Symbol`
    }
    return obj
}
