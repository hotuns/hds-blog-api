interface RulesType {
  [key: string]:
    | string
    | {
        type: string;
        required?: boolean;
        convertType?:
          | "int"
          | "number"
          | "string"
          | "boolean"
          | ((value: any) => any);
        default?: any; // The default value of property, once the property is allowed non-required and missed, parameter will use this as the default value. This may change the original input params
        widelyUndefined?: any; // override options.widelyUndefined
        min?: number;
        max?: number;
        allowEmpty?: boolean; //allow empty string, default to false. If rule.required set to false, allowEmpty will be set to true by default.
        format?: RegExp; // A RegExp to check string's format.
        trim?: boolean; // Trim the string before check, default is false
        compare?: string | null;
      };
}
