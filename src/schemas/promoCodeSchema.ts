import * as yup from 'yup';

export const promoCodeStep1Schema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required('Название промокода обязательно')
    .max(30, 'Максимальная длина 30 символов'),

  title: yup
    .string()
    .required('Заголовок обязателен')
    .max(120, 'Максимальная длина 120 символов'),

  description: yup
    .string()
    .optional()
    .max(250, 'Максимальная длина 250 символов'),

  points: yup
    .number()
    .typeError('Введите число')
    .required('Количество баллов обязательно')
    .positive('Количество баллов должно быть положительным')
    .integer('Количество баллов должно быть целым числом'),
});

export const promoCodeStep2Schema = yup.object().shape({
  startDate: yup
    .date()
    .typeError('Введите корректную дату')
    .required('Дата начала обязательна')
    .min(new Date(), 'Дата начала не может быть в прошлом'),

  endDate: yup
    .date()
    .nullable()
    .transform((value, originalValue) => {
      return originalValue === '' ? null : value;
    })
    .when('hasNoEndDate', {
      is: false,
      then: (schema) => schema
        .typeError('Введите корректную дату')
        .required('Дата окончания обязательна')
        .min(yup.ref('startDate'), 'Дата окончания не может быть раньше начала'),
      otherwise: (schema) => schema.nullable().notRequired(),
    }),

  hasNoEndDate: yup.boolean(),

  activationLimit: yup
    .number()
    .typeError('Введите число')
    .required('Лимит активаций обязателен')
    .positive('Лимит должен быть положительным')
    .integer('Лимит должен быть целым числом'),

  receiveMethod: yup
    .string()
    .oneOf(['auto', 'manual'], 'Выберите способ получения')
    .required('Способ получения обязателен'),
});
