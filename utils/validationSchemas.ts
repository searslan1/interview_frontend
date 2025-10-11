// src/utils/validationSchemas.ts (Yeni dosya oluşturulabilir)

// Bu regex, Backend'deki Joi şemasıyla tam olarak eşleşmelidir:
// (en az 8 karakter, en az bir büyük harf, bir küçük harf, bir rakam, bir özel karakter)
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const commonPasswordSchema = {
    // Backend'de uygulanan kural: min 8 karakter ve karmaşıklık regex'i
    password: {
        required: 'Şifre zorunludur.',
        minLength: {
            value: 8,
            message: 'Şifre en az 8 karakter olmalıdır.',
        },
        pattern: {
            value: passwordRegex,
            message: 'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.',
        },
    },
    // Diğer alanlar buraya eklenebilir (email, name vb.)
};

// Bu kuralı React Hook Form / Zod kullanmadan manuel uygulamak için kullanacağız.
export const getPasswordValidationError = (password: string): string | null => {
    if (!password) {
        return 'Şifre zorunludur.';
    }
    if (password.length < 8) {
        return 'Şifre en az 8 karakter olmalıdır.';
    }
    if (!passwordRegex.test(password)) {
        return 'Şifre en az bir büyük harf, bir küçük harf, bir rakam ve bir özel karakter içermelidir.';
    }
    return null;
};