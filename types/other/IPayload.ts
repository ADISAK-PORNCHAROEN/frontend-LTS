export interface IAdvancedSearchPayload<T> {
  // identityCode : string;
  columnName: keyof T;
  type: AdvancedSearchType;
  conditionName: AdvancedSearchCondition;
  value: string;
}

export type AdvancedSearchType = "DATE" | "STRING" | "NUMBER";

export type AdvancedSearchCondition =
  | "EQUAL"
  | "NOT_EQUAL"
  | "CONTAIN"
  | "NOT_CONTAIN"
  | "BEGIN_WITH"
  | "NOT_BEGIN_WITH"
  | "END_WITH"
  | "EQUAL_NUMBER"
  | "NOT_EQUAL_NUMBER"
  | "GREATER_THAN"
  | "LESS_THAN"
  | "GREATER_THAN_OR_EQUAL_TO"
  | "LESS_THAN_OR_EQUAL_TO"
  | "QUICK_SEARCH_FIRSTNAME_LASTNAME";
