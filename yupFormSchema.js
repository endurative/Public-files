import * as yup from 'yup';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const yupFormSchemas = {
  generic(label: string) {
    return yup.mixed().label(label);
  },
  string(label: string, config?: any) {
    config = config || {};

    let yupChain = yup
      .string()
      .transform((cv, ov) => {
        if (typeof ov === 'string') {
          return ov.trim() === '' ? null : ov.trim();
        }
        return null;
      })
      .nullable()
      .label(label);

    if (config.required) {
      yupChain = yupChain.required();
    }

    if (config.min || config.min === 0) {
      yupChain = yupChain.min(config.min);
    }

    if (config.max) {
      yupChain = yupChain.max(config.max);
    }

    if (config.matches) {
      yupChain = yupChain.matches(config.matches, config.matchesMessage);
    }

    return yupChain;
  },

  email(label: string, config?: any) {
    config = config || {};

    let yupChain = yup
      .string()
      .transform((cv, ov) => {
        return ov === '' ? null : cv;
      })
      .nullable()
      .trim()
      .label(label)
      .email();

    if (config.required) {
      yupChain = yupChain.required();
    }

    if (config.min || config.min === 0) {
      yupChain = yupChain.min(config.min);
    }

    if (config.max) {
      yupChain = yupChain.max(config.max);
    }

    if (config.matches) {
      yupChain = yupChain.matches(config.matches, config.matchesMessage);
    }

    return yupChain;
  },

  boolean(label: string, config?: any) {
    config = config || {};

    let yupChain = yup
      .bool()
      .transform((cv, ov) => {
        if (typeof ov === 'string') {
          return ov === 'true' ? true : ov === 'false' ? false : null;
        }
        return ov;
      })
      .default(false)
      .label(label)
      .nullable();

    if (config.required) {
      yupChain = yupChain.required(`${label} is required`);
    }

    return yupChain;
  },

  relationToOne(label: string, config?: any) {
    config = config || {};

    let yupChain = yup
      .mixed()
      .nullable()
      .label(label)
      .transform((value, originalValue) => {
        if (!originalValue) {
          return null;
        }

        return originalValue.id;
      });

    if (config.required) {
      yupChain = yupChain.required();
    }

    return yupChain;
  },
  stringArray(label: string, config?: any) {
    config = config || {};

    let yupChain = yup
      .array()
      .compact()
      .ensure()
      .of(
        yup
          .string()
          .transform((cv, ov) => {
            // Only call trim if it's a string
            if (typeof ov === 'string') {
              return ov.trim() === '' ? null : ov.trim();
            }
            return null;
          })
          .nullable(),
      )
      .label(label);

    if (config.required || config.min) {
      yupChain = yupChain.required();
    }

    if (config.min || config.min === 0) {
      yupChain = yupChain.min(config.min);
    } else if (config.required) {
      yupChain = yupChain.min(1);
    }

    if (config.max) {
      yupChain = yupChain.max(config.max);
    }

    return yupChain;
  },
  relationToMany(label: string, config?: any) {
    config = config || {};

    let yupChain = yup
      .array()
      .nullable()
      .label(label)
      .transform((value, originalValue) => {
        if (!originalValue || !originalValue.length) {
          return [];
        }

        return originalValue.map((item: {id: string}) => item.id);
      });

    if (config.required || config.min) {
      yupChain = yupChain.required();
    }

    if (config.min || config.min === 0) {
      yupChain = yupChain.min(config.min);
    } else if (config.required) {
      yupChain = yupChain.min(1);
    }

    if (config.max) {
      yupChain = yupChain.max(config.max);
    }

    return yupChain;
  },

  images(label: string, config?: any) {
    config = config || {};

    let yupChain = yup.array().nullable().label(label);

    if (config.required || config.min) {
      yupChain = yupChain.required();
    }

    if (config.min || config.min === 0) {
      yupChain = yupChain.min(config.min);
    } else if (config.required) {
      yupChain = yupChain.min(1);
    }

    if (config.max) {
      yupChain = yupChain.max(config.max);
    }

    return yupChain;
  },
  files(label: string, config?: any) {
    config = config || {};

    let yupChain = yup.array().compact().ensure().nullable().label(label);

    if (config.required || config.min) {
      yupChain = yupChain.required();
    }

    if (config.min || config.min === 0) {
      yupChain = yupChain.min(config.min);
    } else if (config.required) {
      yupChain = yupChain.min(1);
    }

    if (config.max) {
      yupChain = yupChain.max(config.max);
    }

    return yupChain;
  },
  enumerator(label: string, config?: any) {
    config = config || {};

    let yupChain = yup
      .string()
      .transform((cv, ov) => {
        return ov === '' ? null : cv;
      })
      .label(label)
      .nullable()
      .oneOf([null, ...(config.options || [])]);

    return yupChain;
  },

  decimal(label: string, config?: any) {
    config = config || {};
    let yupChain = yup
      .number()
      .transform((cv, ov) => {
        return ov === '' ? null : cv;
      })
      .nullable()
      .label(label)
      .typeError(`${label} must be a valid number`);

    if (config.required) {
      yupChain = yupChain.required();
    }

    if (config.min || config.min === 0) {
      yupChain = yupChain.min(config.min);
    }

    if (config.max) {
      yupChain = yupChain.max(config.max);
    }

    yupChain = yupChain.test(
      'is-decimal',
      `${label} must be a valid decimal number`,
      value => {
        if (value == null) return true;
        return !isNaN(value) && value.toString().includes('.');
      },
    );

    return yupChain;
  },

  integer(label: string, config?: any) {
    config = config || {};
    let yupChain = yup
      .number()
      .transform((cv, ov) => {
        return ov === '' ? null : cv;
      })
      .nullable()
      .label(label)
      .typeError(`${label} must be a valid number`);

    if (config.required) {
      yupChain = yupChain.required();
    }
    if (config.min != null && config.max != null && config.min === config.max) {
      const exactValue = config.min;
      yupChain = yupChain.test(
        'is-exact-value',
        `${label} must be equal to ${exactValue}`,
        value => value == null || String(value).length === exactValue,
      );
    } else {
      if (config.min || config.min === 0) {
        yupChain = yupChain.min(config.min);
      }

      if (config.max) {
        yupChain = yupChain.max(config.max);
      }
    }

    yupChain = yupChain.test(
      'is-integer',
      `${label} must be a valid integer`,
      value => {
        if (value == null) return true;
        return Number.isInteger(value);
      },
    );

    return yupChain;
  },

  datetime(label: string, config?: any) {
    config = config || {};
    let yupChain = yup
      .mixed()
      .nullable()
      .label(label)
      .transform((value, originalValue) =>
        value ? dayjs(originalValue, 'YYYY-MM-DD HH:mm').toISOString() : null,
      );

    if (config.required) {
      yupChain = yupChain.required();
    }

    return yupChain;
  },

  date(label: string, config?: any) {
    config = config || {};
    let yupChain = yup
      .mixed()
      .nullable()
      .label(label)
      .test('is-date', 'Invalid date format', value => {
        if (!value) return true;
        return dayjs(value, 'YYYY-MM-DD', true).isValid();
      })
      .transform(value => (value ? dayjs(value).format('YYYY-MM-DD') : null));

    if (config.required) {
      yupChain = yupChain.required();
    }

    return yupChain;
  },
};

export default yupFormSchemas;
