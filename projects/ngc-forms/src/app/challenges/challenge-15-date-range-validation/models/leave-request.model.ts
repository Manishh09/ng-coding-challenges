/**
 * Leave type enumeration
 */
export type LeaveType = 'vacation' | 'sick' | 'personal' | 'unpaid';

/**
 * Leave request form data structure
 */
export interface LeaveRequestFormData {
  leaveType: LeaveType | '';
  startDate: string;
  endDate: string;
  reason: string;
}

/**
 * Complete leave request with calculated fields
 */
export interface LeaveRequest extends LeaveRequestFormData {
  id: string;
  employeeName: string;
  status: 'pending' | 'approved' | 'rejected';
  totalDays: number;
  submittedAt: Date;
}

/**
 * Date range validation error structure
 */
export interface DateRangeValidationError {
  dateRangeInvalid: {
    message: string;
    startDate: string;
    endDate: string;
  };
}

/**
 * Leave type configuration for UI display
 */
export interface LeaveTypeConfig {
  value: LeaveType;
  label: string;
  maxDays?: number;
  description: string;
}

/**
 * Available leave types with configurations
 */
export const LEAVE_TYPES: LeaveTypeConfig[] = [
  {
    value: 'vacation',
    label: 'Vacation Leave',
    maxDays: 30,
    description: 'Planned time off for rest and recreation'
  },
  {
    value: 'sick',
    label: 'Sick Leave',
    maxDays: 15,
    description: 'Medical leave for illness or health issues'
  },
  {
    value: 'personal',
    label: 'Personal Leave',
    maxDays: 10,
    description: 'Personal matters requiring time off'
  },
  {
    value: 'unpaid',
    label: 'Unpaid Leave',
    description: 'Extended leave without pay'
  }
];
