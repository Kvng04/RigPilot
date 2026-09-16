# Feature Specification: Shift Telematics & Idle-Cost Diagnostic (SPEC.md)

## 1. User Story
As a small construction fleet owner or superintendent, I want to submit daily machine run hours, operator wage rates, and shift logs so that I can instantly see my exact dollar losses from unworked idle time and get an actionable remote command schedule to cut payroll waste.

## 2. Acceptance Criteria
1. **Input Flexibility**: Accepts manual machine hours & wage inputs or pasted OEM logs/meter photos (compressed client-side <1MB).
2. **Deterministic Schema Normalization**: Output strictly conforms to `AuditResult` schema:
   - `totalShiftCost`: Gross operator wage + machine idle fuel expense.
   - `activeWorkCost`: Cost tied directly to productive cutting/cycling.
   - `idlePayrollWaste`: Exact dollar figure lost to idle standby.
   - `efficiencyPercentage`: Ratio of active work to shift length.
   - `machineBreakdown`: Per-machine audit line items with idle percentages and fuel burn.
   - `recommendations`: 3 concise, site-ready supervisory adjustments.
   - `remoteConsolidationPotential`: Estimated monthly savings if shifted to multi-seat remote command.
3. **Robust Safety & Error Resilience**:
   - Server-side payload validation (enforces machine counts 1–50, positive wage rates, sanitized string fields).
   - Rate-limiting (max 15 audits per user/IP per hour).
   - Graceful fallback with human-readable error descriptions on timeout or API anomalies.
4. **Data Isolation**: Audits are saved to `/users/{uid}/audits/{auditId}` in Firestore, readable and writable strictly by the authenticated owner.
