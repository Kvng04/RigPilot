# Product Requirements Document (PRD) — Rigpilot

## 1. Vision & Target User
Rigpilot is a remote command and telemetry diagnostics station that enables small construction fleet owners to eliminate idle labor burn and supervise multi-site machinery remotely.
**Target Audience**: Owner-led civil, asphalt, quarry, aggregate, and excavation companies operating 2–20 machines across multiple job sites facing rising labor costs and operator shortages.

## 2. Problem
Small fleet owners pay full 8-hour operator wages while machines sit idle for 3–5 hours waiting on haul trucks, grade checks, or site logistics. Without dedicated telemetry engineers, fleet owners cannot quantify this invisible payroll leakage or deploy multi-seat remote operations.

## 3. The Hero Feature (Data-Processing & Telematics Diagnostic)
**Shift Telematics & Idle-Cost Diagnostic Engine**: Small fleet owners submit machine hours, timesheet data, or equipment logs. Rigpilot’s server-side engine normalizes telemetry, computes exact payroll loss from idle standby, and generates a multi-seat remote command transition plan.

## 4. MVP Scope (Max 5 Features)
1. **Shift Telematics & Idle-Cost Diagnostic (Hero)**: Structured shift log ingestion, AI-driven machine-cycle normalization, dollarized labor-waste calculation, and actionable supervisor recommendations.
2. **Fleet Machinery Roster**: CRUD tracking of fleet inventory (excavators, dozers, loaders, graders) with equipment classes, fuel burn curves, and assigned job sites.
3. **Multi-Seat Remote Command Planner**: Interactive ROI model calculating labor savings when 1 certified remote operator covers 2–3 machines across disparate sites.
4. **Shift Audit Archive**: Persistent Firestore history of past shift diagnostics with trend analytics and exportable summary briefs.
5. **Webinar & Pilot Program Onboarding**: Value-ladder scheduling for the Free Remote Supervision Briefing and $2,000/mo/machine 2-machine Pilot Program Setup.

## 5. Success Criteria
- Sub-3 second diagnostic audit execution time.
- 100% normalized financial breakdowns with zero unformatted raw model text.
- Verified user isolation in Firestore and server API routes.
