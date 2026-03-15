import { useState, useEffect, useRef } from "react";

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const PATIENTS = [
  { id: 1, Prescriber: "Chorny, Volodymyr", ReferralDate: "2022-06-13", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 24, LastComment: "3/4 - Patient recently received a bridge shipment. NCM assistance needed to ask the patient to follow up with their HCP.", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Health Exchange", PrimaryPayer: "Florida Health Care Plans", PrimaryPBM: "OptumRx", SecondaryChannel: "Medicaid", Territory: "Orlando FL", Region: "Southeast", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-08-08", LastShipDate: "2026-02-23" },
  { id: 2, Prescriber: "Hernandez, Dunia", ReferralDate: "2026-01-16", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 20, LastComment: "3/4 - Tatiana with HCP responded and advised that the 1LA was submitted to plan on 2/27.", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "Miami FL", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-01-21", LastShipDate: "2026-03-02" },
  { id: 3, Prescriber: "Wang, Gregory", ReferralDate: "2024-04-03", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 15, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Medicare", PrimaryPayer: "UnitedHealth Group, Inc.", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "DC/Virginia", Region: "Northeast", Language: "English", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2024-05-20", LastShipDate: "2026-03-05" },
  { id: 4, Prescriber: "Hsu, Alice", ReferralDate: "2026-02-02", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 14, LastComment: null, LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "Dallas TX", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-02-20", LastShipDate: "2026-03-04" },
  { id: 5, Prescriber: "Duffy, Margaret", ReferralDate: "2026-02-06", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 14, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "Western PA/Upstate NY", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-02-18", LastShipDate: "2026-02-26" },
  { id: 6, Prescriber: "Gillespie, Heather", ReferralDate: "2023-03-03", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 11, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Commercial", PrimaryPayer: "Dept. of Defense - TRICARE", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "Los Angeles East", Region: "West", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2023-07-26", LastShipDate: "2026-02-20" },
  { id: 7, Prescriber: "Garcia Sanchez, Hermes", ReferralDate: "2025-12-15", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 10, LastComment: "Appeal needs to be resubmitted by HCP", LatestHUBSubStatus: "No MD Response for Missing Information", PrimaryChannel: "Health Exchange", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "North Georgia", Region: "Southeast", Language: "Spanish", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 8, Prescriber: "Maya Villamizar, Juan Jose", ReferralDate: "2025-10-10", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 8, LastComment: "2/23 - SPOC - Hector replied to the email and sent in clinicals. We'll get this PA submitted shortly.", LatestHUBSubStatus: "Prescriber Decision", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "State of Florida", PrimaryPBM: "Humana PBM", SecondaryChannel: "Medicaid", Territory: "Fort Lauderdale FL", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-10-23", LastShipDate: "2025-10-23" },
  { id: 9, Prescriber: "Vasquez, Karina", ReferralDate: "2025-12-22", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 7, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "CareFirst, Inc.", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "South Texas TX", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-01-07", LastShipDate: "2026-03-05" },
  { id: 10, Prescriber: "Caroway, Megan", ReferralDate: "2023-03-28", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 2, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "New Script Received", PrimaryChannel: "Commercial", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "Commercial (Third Party)", Territory: "Kentuckiana", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2023-06-01", LastShipDate: "2024-08-02" },
  { id: 11, Prescriber: "ALDERSON, THOMAS", ReferralDate: "2026-01-27", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 1, LastComment: "2/11 - Sent the below to ISS: The old CMM key expired and we had to create a new one.", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: null, Territory: "WS Virtual", Region: "WS Virtual", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-02-19", LastShipDate: "2026-03-02" },
  { id: 12, Prescriber: "Nami, Alireza", ReferralDate: "2023-04-18", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 22, LastComment: "3/4- Any update on this case? BH", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Medicare", PrimaryPayer: "UnitedHealth Group, Inc.", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Charlotte NC", Region: "Southeast", Language: "English", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2023-04-28", LastShipDate: "2026-02-19" },
  { id: 13, Prescriber: "Sun, Wei", ReferralDate: "2026-01-21", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 9, LastComment: "Clinicals needed for PA", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Medicare", PrimaryPayer: "Healthfirst", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "Manhattan/Brooklyn NY", Region: "Northeast", Language: "Mandarin Chinese", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-02-24", LastShipDate: "2026-02-24" },
  { id: 14, Prescriber: "Maya-Villamizar, Juan", ReferralDate: "2023-05-11", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 4, LastComment: "2/17: any update on the PA submission?", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "State of Florida", PrimaryPBM: "Humana PBM", SecondaryChannel: "Medicaid", Territory: "Fort Lauderdale FL", Region: "Southeast", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2023-05-12", LastShipDate: "2026-03-03" },
  { id: 15, Prescriber: "Lagatta, Mark", ReferralDate: "2025-12-05", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 2, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "Commercial", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "Orlando FL", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-12-22", LastShipDate: "2026-01-22" },
  { id: 16, Prescriber: "Bilal, Mehwish", ReferralDate: "2025-09-23", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 30, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "Nashville TN", Region: "Central", Language: "English", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2026-02-26", LastShipDate: "2026-03-05" },
  { id: 17, Prescriber: "Bade, Naveen", ReferralDate: "2026-01-22", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 29, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "State Medicaid", PrimaryPayer: "State of Alabama", PrimaryPBM: "DXC Technology", SecondaryChannel: null, Territory: "Alabama", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-02-03", LastShipDate: "2026-02-16" },
  { id: 18, Prescriber: "Alvarez, Naiara", ReferralDate: "2026-01-23", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 21, LastComment: "Assist with contacting patient", LatestHUBSubStatus: "HCP Follow-up in Process", PrimaryChannel: "Commercial", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "South Texas TX", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 19, Prescriber: "Ocneanu, Tudor", ReferralDate: "2026-01-19", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – PA denial letter needed", AgingOfStatus: 29, LastComment: null, LatestHUBSubStatus: null, PrimaryChannel: "Commercial", PrimaryPayer: "Capital Rx PBM", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "El Paso TX", Region: "West", Language: null, HIPPAConsent: null, ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 20, Prescriber: "Kimbler, Kristi", ReferralDate: "2025-02-05", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – PA denial letter needed", AgingOfStatus: 18, LastComment: "3/6 - From ISS: Action Request Feedback – HUB ID: 2888956608, Partner: Biologics. I emailed April on 3/5/26 letting her know you requested the plan to send the complete denial letter.", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "South Georgia", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-02-20", LastShipDate: "2026-02-25" },
  { id: 21, Prescriber: "Miller, Donald", ReferralDate: "2025-02-27", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – PA denial letter needed", AgingOfStatus: 13, LastComment: "Coordinating with SP on free goods request", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Healthfirst", PrimaryPBM: "OptumRx", SecondaryChannel: "Medicaid", Territory: "Miami FL", Region: "Southeast", Language: "Portuguese", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-05-09", LastShipDate: "2025-05-09" },
  { id: 22, Prescriber: "Butler, Sara", ReferralDate: "2022-03-28", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Awaiting decision", AgingOfStatus: 6, LastComment: "Left voicemail for patient, awaiting callback", LatestHUBSubStatus: "W/O Shipment Processed", PrimaryChannel: "Medicaid", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: "Commercial (Third Party)", Territory: "Dallas TX", Region: "Central", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-06-21", LastShipDate: "2022-07-24" },
  { id: 23, Prescriber: "Lopez, Anna", ReferralDate: "2025-02-03", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 12, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Capital Rx PBM", PrimaryPBM: "IngenioRx", SecondaryChannel: "State Medicaid", Territory: "Long Island NY", Region: "Northeast", Language: null, HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2025-03-20", LastShipDate: "2025-10-29" },
  { id: 24, Prescriber: "Reyes, Daniel", ReferralDate: "2025-11-10", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 22, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Denial Received", PrimaryChannel: "State Medicaid", PrimaryPayer: "Ambetter", PrimaryPBM: "DXC Technology", SecondaryChannel: "Commercial (Third Party)", Territory: "Nashville TN", Region: "Central", Language: "French", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 25, Prescriber: "Ford, Amanda", ReferralDate: "2025-02-02", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 20, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Product Shipped - COMM", PrimaryChannel: "State Medicaid", PrimaryPayer: "Cigna Health", PrimaryPBM: "OptumRx", SecondaryChannel: "Commercial (Third Party)", Territory: "Houston TX", Region: "Central", Language: "English", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2025-06-14", LastShipDate: null },
  { id: 26, Prescriber: "Diaz, Samuel", ReferralDate: "2024-09-04", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Appeal submitted", AgingOfStatus: 37, LastComment: "ISS confirmed POC at HCP office", LatestHUBSubStatus: "Product Shipped - COMM", PrimaryChannel: "State Medicaid", PrimaryPayer: "State of Alabama", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: null, Territory: "El Paso TX", Region: "West", Language: "Spanish", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2025-03-01", LastShipDate: "2025-08-13" },
  { id: 27, Prescriber: "Ellis, Emily", ReferralDate: "2023-10-08", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 38, LastComment: "Left voicemail for patient, awaiting callback", LatestHUBSubStatus: "New Script Received", PrimaryChannel: "Medicare", PrimaryPayer: "Capital Rx PBM", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "Michigan", Region: "Northeast", Language: "French", HIPPAConsent: "Electronic", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 28, Prescriber: "Cook, Teresa", ReferralDate: "2024-02-08", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 27, LastComment: "Appeal submitted – 30-day decision window begins today", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Capital Rx PBM", PrimaryPBM: "DXC Technology", SecondaryChannel: "Medicaid", Territory: "South Georgia", Region: "Southeast", Language: "Korean", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2024-02-24", LastShipDate: "2024-05-22" },
  { id: 29, Prescriber: "Herrera, Anna", ReferralDate: "2025-04-10", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – PA denial letter needed", AgingOfStatus: 9, LastComment: "PA submitted, awaiting decision from payer", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Capital Rx PBM", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: "Medicaid", Territory: "Kansas City MO", Region: "Central", Language: "French", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 30, Prescriber: "Jones, Martha", ReferralDate: "2021-08-18", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 8, LastComment: "Plan denied on formulary grounds – 2nd level appeal initiated", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "State Medicaid", PrimaryPayer: "CareFirst, Inc.", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "Medicare", Territory: "Seattle WA", Region: "West", Language: "English", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2021-11-18", LastShipDate: "2022-04-20" },
  { id: 31, Prescriber: "Diaz, Douglas", ReferralDate: "2024-01-10", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Free goods requested", AgingOfStatus: 4, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Denial Received", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "State Medicaid", Territory: "South Texas TX", Region: "Central", Language: "French", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2024-03-15", LastShipDate: "2024-11-04" },
  { id: 32, Prescriber: "Jackson, Maria", ReferralDate: "2024-12-20", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 31, LastComment: "Plan denied on formulary grounds – 2nd level appeal initiated", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Commercial", PrimaryPayer: "State of Florida", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: "Medicare", Territory: "Austin TX", Region: "Central", Language: "Korean", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2025-03-02", LastShipDate: "2025-03-02" },
  { id: 33, Prescriber: "Griffin, Madison", ReferralDate: "2022-05-13", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Trying to reach patient", AgingOfStatus: 43, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "Health Exchange", PrimaryPayer: "Healthfirst", PrimaryPBM: "MedImpact", SecondaryChannel: null, Territory: "WS Virtual", Region: "WS Virtual", Language: "Korean", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-09-08", LastShipDate: "2022-11-26" },
  { id: 34, Prescriber: "Murphy, Sandra", ReferralDate: "2022-01-28", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Formulary exclusion", AgingOfStatus: 4, LastComment: "Plan denied on formulary grounds – 2nd level appeal initiated", LatestHUBSubStatus: "No MD Response for Missing Information", PrimaryChannel: "Health Exchange", PrimaryPayer: "Prime Therapeutics", PrimaryPBM: "Humana PBM", SecondaryChannel: "Commercial (Third Party)", Territory: "San Diego CA", Region: "West", Language: "English", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 35, Prescriber: "Brown, Gerald", ReferralDate: "2021-07-11", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Medical necessity", AgingOfStatus: 0, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Prescriber Decision", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Florida Health Care Plans", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Nashville TN", Region: "Central", Language: "English", HIPPAConsent: "Electronic", ProgramType: "COMM", FirstShipDate: "2021-09-23", LastShipDate: "2022-06-28" },
  { id: 36, Prescriber: "Hicks, Harold", ReferralDate: "2025-01-11", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 30, LastComment: "Coordinating with SP on free goods request", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "State Medicaid", PrimaryPayer: "Cigna Health", PrimaryPBM: "OptumRx", SecondaryChannel: "Medicare", Territory: "Tampa FL", Region: "Southeast", Language: "English", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2025-03-14", LastShipDate: "2025-05-12" },
  { id: 37, Prescriber: "Mitchell, Daniel", ReferralDate: "2021-05-21", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA approved", AgingOfStatus: 36, LastComment: "Patient needs assistance navigating prior auth process", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Cleveland OH", Region: "Northeast", Language: "English", HIPPAConsent: null, ProgramType: null, FirstShipDate: "2021-08-03", LastShipDate: "2022-06-20" },
  { id: 38, Prescriber: "Morris, Samuel", ReferralDate: "2022-06-28", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 34, LastComment: "Coordinating with SP on free goods request", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Health Exchange", PrimaryPayer: "State of Ohio", PrimaryPBM: "IngenioRx", SecondaryChannel: null, Territory: "North Georgia", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-12-24", LastShipDate: "2023-07-03" },
  { id: 39, Prescriber: "Morales, Karen", ReferralDate: "2023-01-27", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – HCP request", AgingOfStatus: 6, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: null, PrimaryChannel: "Commercial", PrimaryPayer: "DXC Technology", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: "Commercial (Third Party)", Territory: "Maryland", Region: "Northeast", Language: "English", HIPPAConsent: null, ProgramType: null, FirstShipDate: "2023-06-02", LastShipDate: "2024-06-26" },
  { id: 40, Prescriber: "Flores, Janice", ReferralDate: "2022-07-12", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 27, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: null, PrimaryChannel: "Health Exchange", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "OptumRx", SecondaryChannel: "Medicaid", Territory: "Atlanta GA", Region: "Southeast", Language: "Spanish", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2022-09-17", LastShipDate: "2023-01-29" },
  { id: 41, Prescriber: "Adams, Anna", ReferralDate: "2025-02-27", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 9, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "No MD Response for Missing Information", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "UnitedHealth Group, Inc.", PrimaryPBM: "DXC Technology", SecondaryChannel: "Medicaid", Territory: "St. Louis MO", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2025-06-30", LastShipDate: "2025-09-25" },
  { id: 42, Prescriber: "Alvarez, Richard", ReferralDate: "2022-03-07", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Trying to reach patient", AgingOfStatus: 1, LastComment: "Patient needs assistance navigating prior auth process", LatestHUBSubStatus: "No MD Response for Missing Information", PrimaryChannel: "Medicare", PrimaryPayer: "Community Health Plan", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "Memphis TN", Region: "Central", Language: null, HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2022-04-16", LastShipDate: "2023-02-26" },
  { id: 43, Prescriber: "Morgan, Angela", ReferralDate: "2021-11-23", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Medical necessity", AgingOfStatus: 14, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Product Shipped - COMM", PrimaryChannel: "Medicare", PrimaryPayer: "Ambetter", PrimaryPBM: "MedImpact", SecondaryChannel: "State Medicaid", Territory: "Manhattan/Brooklyn NY", Region: "Northeast", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-01-03", LastShipDate: "2022-02-21" },
  { id: 44, Prescriber: "Moore, Emma", ReferralDate: "2025-05-03", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 16, LastComment: "Patient recently received a bridge shipment – follow up needed", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Commercial", PrimaryPayer: "OptumRx", PrimaryPBM: "Humana PBM", SecondaryChannel: null, Territory: "Memphis TN", Region: "Central", Language: "Spanish", HIPPAConsent: null, ProgramType: null, FirstShipDate: "2025-10-28", LastShipDate: null },
  { id: 45, Prescriber: "Fisher, Samuel", ReferralDate: "2024-05-26", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA submitted – Awaiting decision", AgingOfStatus: 34, LastComment: "HCP office confirmed appeal letter will be sent this week", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "Commercial", PrimaryPayer: "Department of Defense - TRICARE", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Orlando FL", Region: "Southeast", Language: "English", HIPPAConsent: null, ProgramType: null, FirstShipDate: "2024-07-08", LastShipDate: "2025-05-29" },
  { id: 46, Prescriber: "Hunter, Gregory", ReferralDate: "2022-10-05", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 18, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "State Medicaid", PrimaryPayer: "Healthfirst", PrimaryPBM: "DXC Technology", SecondaryChannel: "State Medicaid", Territory: "Connecticut", Region: "Northeast", Language: "Spanish", HIPPAConsent: null, ProgramType: null, FirstShipDate: "2022-11-19", LastShipDate: "2023-05-21" },
  { id: 47, Prescriber: "Black, Julie", ReferralDate: "2025-03-13", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 38, LastComment: "Appeal submitted – 30-day decision window begins today", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Medicaid", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: null, Territory: "Los Angeles East", Region: "West", Language: "Mandarin Chinese", HIPPAConsent: null, ProgramType: null, FirstShipDate: "2025-08-31", LastShipDate: null },
  { id: 48, Prescriber: "Ellis, Jeffrey", ReferralDate: "2023-08-28", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 14, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Commercial", PrimaryPayer: "Ambetter", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: "Medicaid", Territory: "Michigan", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2023-10-24", LastShipDate: "2024-04-16" },
  { id: 49, Prescriber: "Olson, Andrea", ReferralDate: "2025-10-07", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA submitted – Awaiting decision", AgingOfStatus: 44, LastComment: "Patient recently received a bridge shipment – follow up needed", LatestHUBSubStatus: "Free Goods Dispensed", PrimaryChannel: "Health Exchange", PrimaryPayer: "Florida Health Care Plans", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: null, Territory: "Raleigh NC", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2026-02-14", LastShipDate: null },
  { id: 50, Prescriber: "Hamilton, Terry", ReferralDate: "2021-04-13", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 32, LastComment: "Plan denied on formulary grounds – 2nd level appeal initiated", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "GEHA", PrimaryPBM: "MedImpact", SecondaryChannel: null, Territory: "Kentuckiana", Region: "Northeast", Language: "English", HIPPAConsent: null, ProgramType: null, FirstShipDate: "2021-05-28", LastShipDate: "2022-02-19" },
  { id: 51, Prescriber: "Jordan, Andrea", ReferralDate: "2022-06-15", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Medical necessity", AgingOfStatus: 15, LastComment: "Patient needs assistance navigating prior auth process", LatestHUBSubStatus: "Product Shipped - COMM", PrimaryChannel: "Medicaid", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "Minnesota", Region: "Central", Language: "Portuguese", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-12-09", LastShipDate: "2023-10-01" },
  { id: 52, Prescriber: "Hill, Emily", ReferralDate: "2022-04-19", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Trying to reach patient", AgingOfStatus: 13, LastComment: "Left voicemail for patient, awaiting callback", LatestHUBSubStatus: "W/O Shipment Processed", PrimaryChannel: "Medicaid", PrimaryPayer: "State of Alabama", PrimaryPBM: "MedImpact", SecondaryChannel: "Medicaid", Territory: "Boston MA", Region: "Northeast", Language: null, HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2022-06-11", LastShipDate: "2022-08-12" },
  { id: 53, Prescriber: "Wallace, Julie", ReferralDate: "2021-01-13", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 1, LastComment: "Patient needs assistance navigating prior auth process", LatestHUBSubStatus: "Product Shipped - COMM", PrimaryChannel: "Health Exchange", PrimaryPayer: "Blue Cross Blue Shield of Texas", PrimaryPBM: "Humana PBM", SecondaryChannel: null, Territory: "Los Angeles East", Region: "West", Language: "Korean", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2021-04-13", LastShipDate: "2021-12-13" },
  { id: 54, Prescriber: "Allen, Cheryl", ReferralDate: "2024-06-28", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 3, LastComment: "Left voicemail for patient, awaiting callback", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "State Medicaid", PrimaryPayer: "Healthfirst", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "San Diego CA", Region: "West", Language: "English", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2024-10-20", LastShipDate: "2025-10-24" },
  { id: 55, Prescriber: "Gray, Rachel", ReferralDate: "2025-04-08", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 14, LastComment: null, LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Health Exchange", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: "Medicaid", Territory: "Tampa FL", Region: "Southeast", Language: null, HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-07-02", LastShipDate: "2026-03-04" },
  { id: 56, Prescriber: "Phillips, Angela", ReferralDate: "2025-09-15", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Appeal submitted", AgingOfStatus: 29, LastComment: "HCP office confirmed appeal letter will be sent this week", LatestHUBSubStatus: "Product Shipped - COMM", PrimaryChannel: "Medicare", PrimaryPayer: "CareFirst, Inc.", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "Medicare", Territory: "Chicago IL", Region: "Central", Language: "French", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 57, Prescriber: "Adams, Ashley", ReferralDate: "2022-09-30", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 12, LastComment: "ISS confirmed POC at HCP office", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "DXC Technology", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: "State Medicaid", Territory: "Connecticut", Region: "Northeast", Language: "English", HIPPAConsent: null, ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 58, Prescriber: "Boyd, Katherine", ReferralDate: "2024-05-14", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 21, LastComment: "Payer requested additional clinical documentation", LatestHUBSubStatus: "W/O Shipment Processed", PrimaryChannel: "State Medicaid", PrimaryPayer: "Anthem Blue Cross", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "Las Vegas NV", Region: "West", Language: "English", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2024-10-19", LastShipDate: "2025-05-14" },
  { id: 59, Prescriber: "Silva, Jack", ReferralDate: "2025-12-31", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 15, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Health Exchange", PrimaryPayer: "Healthfirst", PrimaryPBM: "IngenioRx", SecondaryChannel: null, Territory: "Austin TX", Region: "Central", Language: "English", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2026-02-22", LastShipDate: null },
  { id: 60, Prescriber: "Olson, Marie", ReferralDate: "2024-09-30", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Awaiting decision", AgingOfStatus: 38, LastComment: "Plan denied on formulary grounds – 2nd level appeal initiated", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Medicare", PrimaryPayer: "Anthem Blue Cross", PrimaryPBM: "Humana PBM", SecondaryChannel: "Medicaid", Territory: "Western PA/Upstate NY", Region: "Northeast", Language: "Portuguese", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2024-10-21", LastShipDate: "2025-05-05" },
  { id: 61, Prescriber: "Morris, Nancy", ReferralDate: "2025-01-14", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Medical necessity", AgingOfStatus: 14, LastComment: "Requested denial letter from plan", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Health Exchange", PrimaryPayer: "WellCare Health Plans", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Atlanta GA", Region: "Southeast", Language: "Vietnamese", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2025-06-19", LastShipDate: null },
  { id: 62, Prescriber: "Griffin, Dennis", ReferralDate: "2024-02-08", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Reopen – Patient re-engaged", AgingOfStatus: 14, LastComment: "NCM assistance needed to contact patient", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "State Medicaid", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "Humana PBM", SecondaryChannel: null, Territory: "Maryland", Region: "Northeast", Language: "English", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2024-06-09", LastShipDate: "2025-04-16" },
  { id: 63, Prescriber: "Rose, Kathryn", ReferralDate: "2022-01-15", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Medical necessity", AgingOfStatus: 6, LastComment: "SP confirmed shipment – bridge active", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "State Medicaid", PrimaryPayer: "State of Texas", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: "State Medicaid", Territory: "Kansas City MO", Region: "Central", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 64, Prescriber: "Brown, Katherine", ReferralDate: "2024-12-21", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 36, LastComment: "Patient language barrier – Spanish interpreter needed", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "State Medicaid", PrimaryPayer: "Humana PBM", PrimaryPBM: "MedImpact", SecondaryChannel: null, Territory: "North Georgia", Region: "Southeast", Language: "Mandarin Chinese", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-03-15", LastShipDate: "2025-03-15" },
  { id: 65, Prescriber: "Wilson, Deborah", ReferralDate: "2022-06-02", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 3, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "Free Goods Dispensed", PrimaryChannel: "Health Exchange", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "IngenioRx", SecondaryChannel: null, Territory: "Ohio Valley", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2022-10-16", LastShipDate: "2022-10-16" },
  { id: 66, Prescriber: "McDonald, Steven", ReferralDate: "2025-04-15", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 19, LastComment: "Bridge shipment dispatched, patient notified", LatestHUBSubStatus: "Free Goods Dispensed", PrimaryChannel: "Health Exchange", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "Humana PBM", SecondaryChannel: "Medicaid", Territory: "St. Louis MO", Region: "Central", Language: "French", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2025-09-28", LastShipDate: "2026-02-20" },
  { id: 67, Prescriber: "Turner, Margaret", ReferralDate: "2024-07-05", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 38, LastComment: "SP confirmed shipment – bridge active", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Medicare", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: "Medicaid", Territory: "Los Angeles West", Region: "West", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2024-08-08", LastShipDate: "2024-12-04" },
  { id: 68, Prescriber: "Fox, Justin", ReferralDate: "2025-10-27", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA submitted – Awaiting decision", AgingOfStatus: 17, LastComment: "Clinicals needed for PA submission", LatestHUBSubStatus: "W/O Shipment Processed", PrimaryChannel: "Commercial", PrimaryPayer: "State of Alabama", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: "Medicaid", Territory: "Cincinnati OH", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-01-08", LastShipDate: null },
  { id: 69, Prescriber: "Kelly, Marie", ReferralDate: "2023-06-19", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – HCP request", AgingOfStatus: 5, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Free Goods Dispensed", PrimaryChannel: "Medicaid", PrimaryPayer: "State of Florida", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: null, Territory: "Phoenix AZ", Region: "West", Language: "Korean", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 70, Prescriber: "Miller, Eric", ReferralDate: "2021-07-07", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 41, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Centene Corporation", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: "Medicare", Territory: "San Francisco CA", Region: "West", Language: "French", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2021-12-15", LastShipDate: "2022-01-24" },
  { id: 71, Prescriber: "White, Martha", ReferralDate: "2023-08-21", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Awaiting decision", AgingOfStatus: 25, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Health Exchange", PrimaryPayer: "Department of Defense - TRICARE", PrimaryPBM: "MedImpact", SecondaryChannel: null, Territory: "DC/Virginia", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2023-11-28", LastShipDate: "2024-02-19" },
  { id: 72, Prescriber: "Chavez, Eric", ReferralDate: "2021-08-26", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 39, LastComment: null, LatestHUBSubStatus: "Denial Received", PrimaryChannel: "Health Exchange", PrimaryPayer: "UnitedHealth Group, Inc.", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: null, Territory: "Denver CO", Region: "West", Language: null, HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2021-12-21", LastShipDate: "2022-01-20" },
  { id: 73, Prescriber: "Morgan, Jason", ReferralDate: "2024-01-30", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – HCP request", AgingOfStatus: 38, LastComment: "PA submitted, awaiting decision from payer", LatestHUBSubStatus: "Denial Received", PrimaryChannel: "State Medicaid", PrimaryPayer: "CareFirst, Inc.", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "Miami FL", Region: "Southeast", Language: "Portuguese", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 74, Prescriber: "Sullivan, Janice", ReferralDate: "2021-07-10", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Appeal submitted", AgingOfStatus: 26, LastComment: "Patient language barrier – Spanish interpreter needed", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "State Medicaid", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: "State Medicaid", Territory: "Minnesota", Region: "Central", Language: "Mandarin Chinese", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2021-08-22", LastShipDate: "2021-11-20" },
  { id: 75, Prescriber: "Foster, Donna", ReferralDate: "2022-01-26", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 17, LastComment: "SP confirmed shipment – bridge active", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "WellCare Health Plans", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Western PA/Upstate NY", Region: "Northeast", Language: "French", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2022-06-19", LastShipDate: "2022-09-26" },
  { id: 76, Prescriber: "Hill, Martha", ReferralDate: "2023-07-04", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "New referral received", AgingOfStatus: 36, LastComment: "Requested denial letter from plan", LatestHUBSubStatus: "Denial Received", PrimaryChannel: "Medicaid", PrimaryPayer: "Community Health Plan", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: null, Territory: "Wisconsin", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2023-10-14", LastShipDate: "2024-08-17" },
  { id: 77, Prescriber: "Warren, Andrea", ReferralDate: "2026-02-14", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Appeal submitted", AgingOfStatus: 6, LastComment: "Patient recently received a bridge shipment – follow up needed", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Commercial", PrimaryPayer: "Humana PBM", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: null, Territory: "St. Louis MO", Region: "Central", Language: "English", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 78, Prescriber: "Sullivan, Kenneth", ReferralDate: "2025-11-19", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 21, LastComment: "Left voicemail for patient, awaiting callback", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Department of Defense - TRICARE", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Cincinnati OH", Region: "Northeast", Language: "Vietnamese", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2026-01-11", LastShipDate: "2026-01-11" },
  { id: 79, Prescriber: "Marshall, Christian", ReferralDate: "2021-03-15", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA approved", AgingOfStatus: 44, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Health Exchange", PrimaryPayer: "OptumRx", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "Medicaid", Territory: "Los Angeles West", Region: "West", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2021-05-28", LastShipDate: "2021-11-21" },
  { id: 80, Prescriber: "Alvarez, Pamela", ReferralDate: "2023-02-07", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Awaiting decision", AgingOfStatus: 43, LastComment: "Patient language barrier – Spanish interpreter needed", LatestHUBSubStatus: "HCP Follow-up in Process", PrimaryChannel: "Medicare", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "IngenioRx", SecondaryChannel: "Medicare", Territory: "New Jersey", Region: "Northeast", Language: "English", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2023-04-24", LastShipDate: "2024-03-08" },
  { id: 81, Prescriber: "Alexander, Shirley", ReferralDate: "2022-06-07", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 40, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "HCP Follow-up in Process", PrimaryChannel: "Commercial", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "DXC Technology", SecondaryChannel: null, Territory: "St. Louis MO", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-10-18", LastShipDate: "2023-10-29" },
  { id: 82, Prescriber: "Moreno, Tyler", ReferralDate: "2021-08-07", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – HCP request", AgingOfStatus: 36, LastComment: "Bridge shipment dispatched, patient notified", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "DXC Technology", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Austin TX", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-01-14", LastShipDate: "2022-07-14" },
  { id: 83, Prescriber: "Cruz, Patrick", ReferralDate: "2024-07-27", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 2, LastComment: "HCP office confirmed appeal letter will be sent this week", LatestHUBSubStatus: "No MD Response for Missing Information", PrimaryChannel: "State Medicaid", PrimaryPayer: "OptumRx", PrimaryPBM: "OptumRx", SecondaryChannel: "Medicare", Territory: "Maryland", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 84, Prescriber: "Sullivan, Rachel", ReferralDate: "2023-05-01", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Appeal submitted", AgingOfStatus: 30, LastComment: "Patient needs assistance navigating prior auth process", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "State of Florida", PrimaryPBM: "Humana PBM", SecondaryChannel: "Commercial (Third Party)", Territory: "Nashville TN", Region: "Central", Language: "Mandarin Chinese", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 85, Prescriber: "Grant, Kenneth", ReferralDate: "2022-04-08", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Free goods requested", AgingOfStatus: 7, LastComment: "HCP office confirmed appeal letter will be sent this week", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Florida Health Care Plans", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "El Paso TX", Region: "West", Language: "French", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2022-08-01", LastShipDate: "2023-06-12" },
  { id: 86, Prescriber: "Ramirez, Diane", ReferralDate: "2024-10-14", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Reopen – Patient re-engaged", AgingOfStatus: 41, LastComment: "Patient recently received a bridge shipment – follow up needed", LatestHUBSubStatus: "Product Shipped - COMM", PrimaryChannel: "State Medicaid", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "MedImpact", SecondaryChannel: "Medicare", Territory: "Wisconsin", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2024-11-03", LastShipDate: "2025-09-16" },
  { id: 87, Prescriber: "Hayes, Katherine", ReferralDate: "2021-08-26", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 44, LastComment: "Payer requested additional clinical documentation", LatestHUBSubStatus: "No MD Response for Missing Information", PrimaryChannel: "Health Exchange", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "DXC Technology", SecondaryChannel: "Medicare", Territory: "Cleveland OH", Region: "Northeast", Language: "Spanish", HIPPAConsent: null, ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 88, Prescriber: "Cole, Margaret", ReferralDate: "2024-06-14", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Free goods requested", AgingOfStatus: 43, LastComment: "Plan denied on formulary grounds – 2nd level appeal initiated", LatestHUBSubStatus: "Prescriber Decision", PrimaryChannel: "Health Exchange", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: null, Territory: "Long Island NY", Region: "Northeast", Language: "English", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2024-09-07", LastShipDate: "2024-09-07" },
  { id: 89, Prescriber: "Carter, Larry", ReferralDate: "2021-09-08", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA submitted – Awaiting decision", AgingOfStatus: 36, LastComment: "Clinicals needed for PA submission", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "WellCare Health Plans", PrimaryPBM: "DXC Technology", SecondaryChannel: "State Medicaid", Territory: "South Texas TX", Region: "Central", Language: "French", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-01-16", LastShipDate: "2022-01-16" },
  { id: 90, Prescriber: "James, Kathleen", ReferralDate: "2025-05-05", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 11, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Humana PBM", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: "Medicare", Territory: "Seattle WA", Region: "West", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 91, Prescriber: "Freeman, Gary", ReferralDate: "2022-10-26", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 4, LastComment: "Appeal submitted – 30-day decision window begins today", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Medicare", PrimaryPayer: "Molina Healthcare", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Denver CO", Region: "West", Language: "Portuguese", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 92, Prescriber: "Jordan, Sandra", ReferralDate: "2023-10-29", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 25, LastComment: "Patient recently received a bridge shipment – follow up needed", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Health Exchange", PrimaryPayer: "Capital Rx PBM", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Tampa FL", Region: "Southeast", Language: "Korean", HIPPAConsent: "Electronic", ProgramType: "COMM", FirstShipDate: "2024-04-17", LastShipDate: "2024-04-17" },
  { id: 93, Prescriber: "Lee, Christopher", ReferralDate: "2022-10-22", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 32, LastComment: "Payer requested additional clinical documentation", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Health Exchange", PrimaryPayer: "State of Ohio", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: "Commercial (Third Party)", Territory: "DC/Virginia", Region: "Northeast", Language: null, HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2022-11-21", LastShipDate: "2022-11-21" },
  { id: 94, Prescriber: "Munoz, Ashley", ReferralDate: "2024-08-26", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Trying to reach patient", AgingOfStatus: 26, LastComment: "Patient needs assistance navigating prior auth process", LatestHUBSubStatus: "Denial Received", PrimaryChannel: "Medicare", PrimaryPayer: "Healthfirst", PrimaryPBM: "DXC Technology", SecondaryChannel: null, Territory: "San Diego CA", Region: "West", Language: "Spanish", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2025-01-28", LastShipDate: "2025-06-17" },
  { id: 95, Prescriber: "Myers, Shirley", ReferralDate: "2021-11-09", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 3, LastComment: "Plan denied on formulary grounds – 2nd level appeal initiated", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Health Exchange", PrimaryPayer: "OptumRx", PrimaryPBM: "DXC Technology", SecondaryChannel: null, Territory: "Charlotte NC", Region: "Southeast", Language: "Vietnamese", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2022-03-24", LastShipDate: "2022-03-24" },
  { id: 96, Prescriber: "Price, Christina", ReferralDate: "2025-11-25", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 32, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "DXC Technology", SecondaryChannel: null, Territory: "North Georgia", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 97, Prescriber: "McDonald, Catherine", ReferralDate: "2023-01-23", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 43, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Product Shipped - COMM", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Healthfirst", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: null, Territory: "Kentuckiana", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 98, Prescriber: "Fox, Brenda", ReferralDate: "2025-04-11", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Appeal submitted", AgingOfStatus: 33, LastComment: "Left voicemail for patient, awaiting callback", LatestHUBSubStatus: "Free Goods Dispensed", PrimaryChannel: "Commercial", PrimaryPayer: "Humana PBM", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Atlanta GA", Region: "Southeast", Language: "Mandarin Chinese", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2025-07-20", LastShipDate: "2025-11-19" },
  { id: 99, Prescriber: "Patel, Kevin", ReferralDate: "2022-10-01", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Appeal submitted", AgingOfStatus: 17, LastComment: "Payer requested additional clinical documentation", LatestHUBSubStatus: "HCP Follow-up in Process", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "State of Ohio", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Michigan", Region: "Northeast", Language: "French", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2023-03-09", LastShipDate: "2023-05-04" },
  { id: 100, Prescriber: "Cooper, Adam", ReferralDate: "2022-03-18", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – HCP request", AgingOfStatus: 25, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "DXC Technology", PrimaryPBM: "Humana PBM", SecondaryChannel: "Medicaid", Territory: "Fort Lauderdale FL", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-04-30", LastShipDate: "2022-07-25" },
  { id: 101, Prescriber: "Scott, Jeffrey", ReferralDate: "2025-04-15", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Medical necessity", AgingOfStatus: 14, LastComment: "Plan denied on formulary grounds – 2nd level appeal initiated", LatestHUBSubStatus: "W/O Shipment Processed", PrimaryChannel: "Medicare", PrimaryPayer: "Humana PBM", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Seattle WA", Region: "West", Language: "English", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2025-07-21", LastShipDate: "2025-07-21" },
  { id: 102, Prescriber: "Fisher, Richard", ReferralDate: "2021-02-08", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Trying to reach patient", AgingOfStatus: 25, LastComment: "Patient needs assistance navigating prior auth process", LatestHUBSubStatus: "Free Goods Dispensed", PrimaryChannel: "State Medicaid", PrimaryPayer: "Capital Rx PBM", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: "Medicare", Territory: "DC/Virginia", Region: "Northeast", Language: null, HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2021-03-13", LastShipDate: "2022-01-31" },
  { id: 103, Prescriber: "Rose, Megan", ReferralDate: "2026-02-27", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – PA denial letter needed", AgingOfStatus: 25, LastComment: "Patient needs assistance navigating prior auth process", LatestHUBSubStatus: "Product Shipped - COMM", PrimaryChannel: "Health Exchange", PrimaryPayer: "State of Texas", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: "State Medicaid", Territory: "Denver CO", Region: "West", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 104, Prescriber: "Ellis, Lisa", ReferralDate: "2024-07-20", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 9, LastComment: "Patient recently received a bridge shipment – follow up needed", LatestHUBSubStatus: "Prescriber Decision", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Anthem Blue Cross", PrimaryPBM: "DXC Technology", SecondaryChannel: "Medicare", Territory: "WS Virtual", Region: "WS Virtual", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 105, Prescriber: "Burns, George", ReferralDate: "2021-11-10", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Medical necessity", AgingOfStatus: 36, LastComment: "Patient needs assistance navigating prior auth process", LatestHUBSubStatus: "Denial Received", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "State of Texas", PrimaryPBM: "IngenioRx", SecondaryChannel: null, Territory: "Los Angeles West", Region: "West", Language: "English", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2021-12-13", LastShipDate: "2022-11-29" },
  { id: 106, Prescriber: "Reynolds, Karen", ReferralDate: "2023-06-25", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 23, LastComment: "Clinicals needed for PA submission", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Medicaid", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "MedImpact", SecondaryChannel: "Commercial (Third Party)", Territory: "Fort Lauderdale FL", Region: "Southeast", Language: "French", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2023-09-17", LastShipDate: "2024-04-14" },
  { id: 107, Prescriber: "Foster, Frances", ReferralDate: "2023-08-06", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA submitted – Awaiting decision", AgingOfStatus: 28, LastComment: "Patient needs assistance navigating prior auth process", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "CareFirst, Inc.", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: "Commercial (Third Party)", Territory: "Raleigh NC", Region: "Southeast", Language: "Portuguese", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2023-08-30", LastShipDate: "2024-07-17" },
  { id: 108, Prescriber: "Hernandez, George", ReferralDate: "2022-05-23", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Awaiting decision", AgingOfStatus: 43, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "Medicaid", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Boston MA", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-09-26", LastShipDate: "2023-09-03" },
  { id: 109, Prescriber: "McDonald, Anthony", ReferralDate: "2024-10-21", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Appeal submitted", AgingOfStatus: 41, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Commercial", PrimaryPayer: "State of Texas", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: "Commercial (Third Party)", Territory: "Manhattan/Brooklyn NY", Region: "Northeast", Language: "English", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2025-01-07", LastShipDate: "2026-01-08" },
  { id: 110, Prescriber: "Snyder, Jerry", ReferralDate: "2025-06-10", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 1, LastComment: "SP confirmed shipment – bridge active", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "UnitedHealth Group, Inc.", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Chicago IL", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-07-15", LastShipDate: "2026-02-28" },
  { id: 111, Prescriber: "Wells, Anna", ReferralDate: "2026-05-08", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "TTRP – Therapy reinitiation pending", AgingOfStatus: 17, LastComment: "Free goods approved and dispensed", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Commercial", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: null, Territory: "Orlando FL", Region: "Southeast", Language: "English", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 112, Prescriber: "Campbell, Karen", ReferralDate: "2026-11-23", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "New referral received", AgingOfStatus: 36, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "New Script Received", PrimaryChannel: "State Medicaid", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: null, Territory: "Los Angeles East", Region: "West", Language: "Spanish", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2025-05-26", LastShipDate: "2024-12-14" },
  { id: 113, Prescriber: "Roberts, David", ReferralDate: "2021-07-03", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Awaiting decision", AgingOfStatus: 22, LastComment: "Reopen request received from HCP", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "Health Exchange", PrimaryPayer: "State of Texas", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "Minnesota", Region: "Central", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-06-19", LastShipDate: "2024-01-22" },
  { id: 114, Prescriber: "Webb, Michelle", ReferralDate: "2026-11-03", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA approved – Active", AgingOfStatus: 11, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "State Medicaid", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "WS Virtual", Region: "WS Virtual", Language: "English", HIPPAConsent: null, ProgramType: null, FirstShipDate: "2022-03-15", LastShipDate: "2026-12-18" },
  { id: 115, Prescriber: "Adams, Brenda", ReferralDate: "2024-07-21", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Medical necessity", AgingOfStatus: 41, LastComment: "W/O shipment processed per HCP request", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "State Medicaid", PrimaryPayer: "State of Texas", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: null, Territory: "Phoenix AZ", Region: "West", Language: "English", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 116, Prescriber: "Hughes, Mary", ReferralDate: "2021-03-21", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Awaiting decision", AgingOfStatus: 11, LastComment: "Patient confirmed receipt of shipment", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "MedImpact", SecondaryChannel: null, Territory: "Nashville TN", Region: "Southeast", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2024-10-03", LastShipDate: "2026-08-17" },
  { id: 117, Prescriber: "Johnson, Scott", ReferralDate: "2022-09-04", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 24, LastComment: "3/4 - Patient recently received a bridge shipment. NCM assistance needed.", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "WellCare Health Plans", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: "State Medicaid", Territory: "St. Louis MO", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2025-10-07", LastShipDate: "2024-09-25" },
  { id: 118, Prescriber: "Hughes, Lisa", ReferralDate: "2024-02-25", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Free goods dispensed", AgingOfStatus: 9, LastComment: "Plan requires additional clinical documentation", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Medicare", PrimaryPayer: "Humana PBM", PrimaryPBM: "MedImpact", SecondaryChannel: "Medicaid", Territory: "Chicago IL", Region: "Central", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 119, Prescriber: "Nguyen, Emma", ReferralDate: "2022-04-03", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 26, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Medicare", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "OptumRx", SecondaryChannel: "State Medicaid", Territory: "Dallas TX", Region: "Central", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 120, Prescriber: "White, Sharon", ReferralDate: "2024-04-18", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Insurance issue", AgingOfStatus: 9, LastComment: "Free goods approved and dispensed", LatestHUBSubStatus: "Reopen - Patient Restarting Therapy", PrimaryChannel: "Commercial", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "San Francisco CA", Region: "West", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-10-16", LastShipDate: "2025-07-07" },
  { id: 121, Prescriber: "Adams, Barbara", ReferralDate: "2025-08-05", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Reopen – Patient restarting therapy", AgingOfStatus: 38, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "UnitedHealth Group, Inc.", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "Medicaid", Territory: "Los Angeles East", Region: "West", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 122, Prescriber: "Baker, Ryan", ReferralDate: "2024-01-06", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Insurance issue", AgingOfStatus: 32, LastComment: "Patient confirmed receipt of shipment", LatestHUBSubStatus: "PA Submitted", PrimaryChannel: "Commercial", PrimaryPayer: "Humana PBM", PrimaryPBM: "MedImpact", SecondaryChannel: "Medicaid", Territory: "Los Angeles East", Region: "West", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 123, Prescriber: "Thomas, Nancy", ReferralDate: "2026-06-02", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "W/O shipment processed", AgingOfStatus: 4, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "W/O Shipment Processed", PrimaryChannel: "State Medicaid", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: "State Medicaid", Territory: "Miami FL", Region: "Southeast", Language: "Mandarin Chinese", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2025-09-06", LastShipDate: null },
  { id: 124, Prescriber: "Jenkins, Joshua", ReferralDate: "2026-10-19", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "New referral received", AgingOfStatus: 25, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Health Exchange", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "Commercial (Third Party)", Territory: "Ohio Valley", Region: "Northeast", Language: "Portuguese", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2022-11-23", LastShipDate: "2025-07-05" },
  { id: 125, Prescriber: "Hughes, Joshua", ReferralDate: "2023-02-08", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Awaiting decision", AgingOfStatus: 30, LastComment: "SP confirmed shipment – bridge active", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "Commercial", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "Humana PBM", SecondaryChannel: "Commercial (Third Party)", Territory: "Indianapolis IN", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2024-09-23", LastShipDate: "2026-09-01" },
  { id: 126, Prescriber: "Moore, Samantha", ReferralDate: "2023-04-22", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Awaiting decision", AgingOfStatus: 20, LastComment: "TTRP initiated – therapy reinitiation in progress", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "UnitedHealth Group, Inc.", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "WS Virtual", Region: "WS Virtual", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2023-01-03", LastShipDate: "2025-01-01" },
  { id: 127, Prescriber: "Martinez, Amanda", ReferralDate: "2025-03-14", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA approved – Active", AgingOfStatus: 9, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "No MD Response for Missing Information", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Community Health Plan", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "Wisconsin", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 128, Prescriber: "Garcia, Jacob", ReferralDate: "2026-06-26", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA submitted – Awaiting decision", AgingOfStatus: 36, LastComment: "TTRP initiated – therapy reinitiation in progress", LatestHUBSubStatus: "No MD Response for Missing Information", PrimaryChannel: "Medicaid", PrimaryPayer: "CareFirst, Inc.", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: "Medicare", Territory: "DC/Virginia", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2026-04-09", LastShipDate: "2026-02-13" },
  { id: 129, Prescriber: "Robinson, Justin", ReferralDate: "2021-05-12", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 35, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "State of Florida", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Nashville TN", Region: "Southeast", Language: "Mandarin Chinese", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2025-06-01", LastShipDate: null },
  { id: 130, Prescriber: "Reyes, Betty", ReferralDate: "2023-01-23", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Insurance issue", AgingOfStatus: 38, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "MedImpact", SecondaryChannel: "Medicare", Territory: "Los Angeles East", Region: "West", Language: "Portuguese", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 131, Prescriber: "Murphy, Daniel", ReferralDate: "2026-05-18", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "TTRP – Therapy reinitiation pending", AgingOfStatus: 9, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Prescriber Decision", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "UnitedHealth Group, Inc.", PrimaryPBM: "MedImpact", SecondaryChannel: "Commercial (Third Party)", Territory: "Cincinnati OH", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 132, Prescriber: "Mitchell, Angela", ReferralDate: "2023-08-15", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "W/O shipment processed", AgingOfStatus: 39, LastComment: "Requested denial letter from plan", LatestHUBSubStatus: "New Script Received", PrimaryChannel: "Medicare", PrimaryPayer: "WellCare Health Plans", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: null, Territory: "Phoenix AZ", Region: "West", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-08-26", LastShipDate: "2026-03-22" },
  { id: 133, Prescriber: "Gomez, James", ReferralDate: "2025-02-15", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Insurance issue", AgingOfStatus: 36, LastComment: "Bridge shipment dispatched, patient notified", LatestHUBSubStatus: "Denial Received", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Centene Corporation", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Kansas City MO", Region: "Central", Language: "Portuguese", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-04-23", LastShipDate: "2025-07-08" },
  { id: 134, Prescriber: "Howard, Christopher", ReferralDate: "2024-11-17", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 25, LastComment: "TTRP initiated – therapy reinitiation in progress", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "Medicare", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "Humana PBM", SecondaryChannel: "State Medicaid", Territory: "Atlanta GA", Region: "Southeast", Language: "French", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2024-10-27", LastShipDate: "2026-07-27" },
  { id: 135, Prescriber: "Scott, William", ReferralDate: "2023-04-09", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Insurance issue", AgingOfStatus: 26, LastComment: "Requested denial letter from plan", LatestHUBSubStatus: "Reopen - Patient Restarting Therapy", PrimaryChannel: "State Medicaid", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: "Commercial (Third Party)", Territory: "WS Virtual", Region: "WS Virtual", Language: "Spanish", HIPPAConsent: "Electronic", ProgramType: "COMM", FirstShipDate: "2025-02-05", LastShipDate: "2025-12-05" },
  { id: 136, Prescriber: "Cruz, Nicole", ReferralDate: "2025-07-16", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 1, LastComment: "Bridge shipment dispatched, patient notified", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "State Medicaid", PrimaryPayer: "Dept. of Defense - TRICARE", PrimaryPBM: "OptumRx", SecondaryChannel: "Commercial (Third Party)", Territory: "Nashville TN", Region: "Southeast", Language: "Spanish", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2023-07-28", LastShipDate: "2025-09-24" },
  { id: 137, Prescriber: "Bailey, Sarah", ReferralDate: "2022-08-05", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Awaiting decision", AgingOfStatus: 2, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "State Medicaid", PrimaryPayer: "State of Florida", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: "Commercial (Third Party)", Territory: "Chicago IL", Region: "Central", Language: "French", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-10-22", LastShipDate: null },
  { id: 138, Prescriber: "Gomez, Jennifer", ReferralDate: "2024-05-27", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA approved – Active", AgingOfStatus: 6, LastComment: "Clinicals needed for PA submission", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "CareFirst, Inc.", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "North Georgia", Region: "Southeast", Language: "French", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2026-09-02", LastShipDate: "2025-04-21" },
  { id: 139, Prescriber: "Rogers, Betty", ReferralDate: "2023-06-06", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "TTRP – Therapy reinitiation pending", AgingOfStatus: 8, LastComment: "Bridge shipment dispatched, patient notified", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Medicaid", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "OptumRx", SecondaryChannel: "Medicaid", Territory: "WS Virtual", Region: "WS Virtual", Language: "Spanish", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2022-05-04", LastShipDate: "2025-10-22" },
  { id: 140, Prescriber: "Gutierrez, Daniel", ReferralDate: "2025-11-11", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "Free goods dispensed", AgingOfStatus: 1, LastComment: "Patient language barrier – interpreter needed", LatestHUBSubStatus: "PA Submitted", PrimaryChannel: "Health Exchange", PrimaryPayer: "Community Health Plan", PrimaryPBM: "MedImpact", SecondaryChannel: null, Territory: "Fort Lauderdale FL", Region: "Southeast", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2024-02-14", LastShipDate: "2026-08-23" },
  { id: 141, Prescriber: "Ross, Kimberly", ReferralDate: "2024-10-20", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 32, LastComment: "NCM outreach attempted – no response", LatestHUBSubStatus: "Free Goods Dispensed", PrimaryChannel: "Commercial", PrimaryPayer: "CareFirst, Inc.", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Los Angeles West", Region: "West", Language: "French", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2024-06-06", LastShipDate: "2025-05-11" },
  { id: 142, Prescriber: "Reed, Ashley", ReferralDate: "2026-08-15", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "TTRP – Therapy reinitiation pending", AgingOfStatus: 2, LastComment: null, LatestHUBSubStatus: "PA Submitted", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "State of Texas", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "Phoenix AZ", Region: "West", Language: null, HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 143, Prescriber: "Crawford, Kathleen", ReferralDate: "2023-05-08", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "TTRP – Therapy reinitiation pending", AgingOfStatus: 8, LastComment: "NCM outreach attempted – no response", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Commercial", PrimaryPayer: "Humana PBM", PrimaryPBM: "MedImpact", SecondaryChannel: null, Territory: "North Georgia", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2023-02-24", LastShipDate: "2026-03-07" },
  { id: 144, Prescriber: "Williams, Pamela", ReferralDate: "2025-03-09", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 3, LastComment: "HCP confirmed appeal submitted to plan", LatestHUBSubStatus: "Reopen - Patient Restarting Therapy", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Cigna Health", PrimaryPBM: "OptumRx", SecondaryChannel: "Medicare", Territory: "WS Virtual", Region: "WS Virtual", Language: "English", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2025-05-23", LastShipDate: "2026-08-04" },
  { id: 145, Prescriber: "Myers, Joshua", ReferralDate: "2021-10-21", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA approved – Active", AgingOfStatus: 4, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Medicare", PrimaryPayer: "State of Alabama", PrimaryPBM: "IngenioRx", SecondaryChannel: "Medicare", Territory: "Kansas City MO", Region: "Central", Language: "French", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 146, Prescriber: "Hughes, Barbara", ReferralDate: "2025-01-20", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 7, LastComment: "Free goods approved and dispensed", LatestHUBSubStatus: "Reopen - Patient Restarting Therapy", PrimaryChannel: "Health Exchange", PrimaryPayer: "WellCare Health Plans", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Wisconsin", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2022-11-07", LastShipDate: "2024-03-08" },
  { id: 147, Prescriber: "Young, Barbara", ReferralDate: "2026-04-09", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Awaiting decision", AgingOfStatus: 14, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Health Exchange", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "IngenioRx", SecondaryChannel: null, Territory: "Fort Lauderdale FL", Region: "Southeast", Language: null, HIPPAConsent: "Written", ProgramType: null, FirstShipDate: "2025-04-21", LastShipDate: null },
  { id: 148, Prescriber: "Long, Emma", ReferralDate: "2025-08-15", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Medical necessity", AgingOfStatus: 6, LastComment: "W/O shipment processed per HCP request", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Commercial", PrimaryPayer: "Dept. of Defense - TRICARE", PrimaryPBM: "Humana PBM", SecondaryChannel: "Commercial (Third Party)", Territory: "St. Louis MO", Region: "Central", Language: "Korean", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2024-12-11", LastShipDate: "2024-02-08" },
  { id: 149, Prescriber: "Parker, Edward", ReferralDate: "2026-08-03", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 43, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Prescriber Decision", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "IngenioRx", SecondaryChannel: null, Territory: "Ohio Valley", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2023-06-22", LastShipDate: null },
  { id: 150, Prescriber: "Flores, Helen", ReferralDate: "2024-09-27", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 1, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Free Goods Dispensed", PrimaryChannel: "Medicaid", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "MedImpact", SecondaryChannel: "State Medicaid", Territory: "Seattle WA", Region: "West", Language: "French", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2025-08-14", LastShipDate: null },
  { id: 151, Prescriber: "Walker, Amy", ReferralDate: "2022-12-06", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Step therapy", AgingOfStatus: 24, LastComment: "NCM outreach attempted – no response", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "State Medicaid", PrimaryPayer: "Dept. of Defense - TRICARE", PrimaryPBM: "IngenioRx", SecondaryChannel: "Commercial (Third Party)", Territory: "Denver CO", Region: "West", Language: "English", HIPPAConsent: "Electronic", ProgramType: "COMM", FirstShipDate: "2025-07-03", LastShipDate: "2024-08-04" },
  { id: 152, Prescriber: "Mitchell, Joshua", ReferralDate: "2025-09-24", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "TTRP – Therapy reinitiation pending", AgingOfStatus: 9, LastComment: "HCP confirmed appeal submitted to plan", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Health Exchange", PrimaryPayer: "Dept. of Defense - TRICARE", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: null, Territory: "Los Angeles East", Region: "West", Language: "Spanish", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2023-07-11", LastShipDate: "2026-05-27" },
  { id: 153, Prescriber: "Cook, Karen", ReferralDate: "2023-04-23", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 19, LastComment: "SP confirmed shipment – bridge active", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "Commercial", PrimaryPayer: "Centene Corporation", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "Medicaid", Territory: "Indianapolis IN", Region: "Central", Language: "Portuguese", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2022-07-02", LastShipDate: "2025-12-26" },
  { id: 154, Prescriber: "Wells, Jonathan", ReferralDate: "2026-03-03", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "New referral received", AgingOfStatus: 43, LastComment: "HCP confirmed appeal submitted to plan", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Commercial", PrimaryPayer: "CareFirst, Inc.", PrimaryPBM: "MedImpact", SecondaryChannel: null, Territory: "Ohio Valley", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2023-06-20", LastShipDate: "2026-02-28" },
  { id: 155, Prescriber: "Morris, Sharon", ReferralDate: "2021-08-06", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA approved – Active", AgingOfStatus: 24, LastComment: "NCM outreach attempted – no response", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Commercial", PrimaryPayer: "Cigna Health", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: null, Territory: "WS Virtual", Region: "WS Virtual", Language: "English", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2021-06-26", LastShipDate: null },
  { id: 156, Prescriber: "Cox, Andrew", ReferralDate: "2025-03-08", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "Reopen – Patient restarting therapy", AgingOfStatus: 41, LastComment: "PA submitted, awaiting decision from payer", LatestHUBSubStatus: "New Script Received", PrimaryChannel: "Health Exchange", PrimaryPayer: "State of Texas", PrimaryPBM: "MedImpact", SecondaryChannel: "Medicare", Territory: "Kansas City MO", Region: "Central", Language: "Korean", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2024-05-22", LastShipDate: null },
  { id: 157, Prescriber: "Long, Amanda", ReferralDate: "2023-04-13", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Step therapy", AgingOfStatus: 43, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "State Medicaid", PrimaryPayer: "Oscar Insurance", PrimaryPBM: "OptumRx", SecondaryChannel: "Medicaid", Territory: "Nashville TN", Region: "Southeast", Language: "Mandarin Chinese", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 158, Prescriber: "Allen, Raymond", ReferralDate: "2023-04-20", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 28, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Reopen - Patient Restarting Therapy", PrimaryChannel: "Commercial", PrimaryPayer: "State of Texas", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: "Medicare", Territory: "Charlotte NC", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-10-09", LastShipDate: "2026-11-22" },
  { id: 159, Prescriber: "Collins, Joseph", ReferralDate: "2022-03-26", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 30, LastComment: "SP confirmed shipment – bridge active", LatestHUBSubStatus: "W/O Shipment Processed", PrimaryChannel: "State Medicaid", PrimaryPayer: "State of Texas", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "Medicare", Territory: "DC/Virginia", Region: "Northeast", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2023-03-09", LastShipDate: "2025-05-24" },
  { id: 160, Prescriber: "Turner, Brandon", ReferralDate: "2023-11-24", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 20, LastComment: "TTRP initiated – therapy reinitiation in progress", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "State Medicaid", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: "State Medicaid", Territory: "Kentuckiana", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-06-04", LastShipDate: "2025-01-20" },
  { id: 161, Prescriber: "Walker, Rebecca", ReferralDate: "2022-09-05", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Awaiting decision", AgingOfStatus: 32, LastComment: "HCP confirmed appeal submitted to plan", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Medicaid", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: "Commercial (Third Party)", Territory: "Dallas TX", Region: "Central", Language: "English", HIPPAConsent: "Electronic", ProgramType: "COMM", FirstShipDate: "2026-12-23", LastShipDate: "2025-10-24" },
  { id: 162, Prescriber: "Lee, Jessica", ReferralDate: "2026-06-18", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 28, LastComment: "Clinicals needed for PA submission", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Commercial", PrimaryPayer: "State of Florida", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: null, Territory: "Dallas TX", Region: "Central", Language: "English", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 163, Prescriber: "Robinson, Joseph", ReferralDate: "2025-04-27", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Appeal letter sent to HCP", AgingOfStatus: 17, LastComment: "SP confirmed shipment – bridge active", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "CareFirst, Inc.", PrimaryPBM: "Navitus Health Solutions", SecondaryChannel: null, Territory: "Los Angeles East", Region: "West", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-10-01", LastShipDate: "2024-03-18" },
  { id: 164, Prescriber: "Torres, Brandon", ReferralDate: "2024-09-04", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Free goods dispensed", AgingOfStatus: 5, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Reopen - Patient Restarting Therapy", PrimaryChannel: "Commercial", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "IngenioRx", SecondaryChannel: "State Medicaid", Territory: "Chicago IL", Region: "Central", Language: "Spanish", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: "2023-09-19", LastShipDate: null },
  { id: 165, Prescriber: "Murphy, Scott", ReferralDate: "2024-02-03", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Step therapy", AgingOfStatus: 25, LastComment: "TTRP initiated – therapy reinitiation in progress", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Commercial", PrimaryPayer: "Blue Cross and Blue Shield of Kansas", PrimaryPBM: "Humana PBM", SecondaryChannel: null, Territory: "WS Virtual", Region: "WS Virtual", Language: null, HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2021-03-09", LastShipDate: "2026-09-23" },
  { id: 166, Prescriber: "Anderson, Elizabeth", ReferralDate: "2023-08-13", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 36, LastComment: "Free goods approved and dispensed", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "Humana PBM", SecondaryChannel: "Medicaid", Territory: "Ohio Valley", Region: "Northeast", Language: "English", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2023-07-11", LastShipDate: "2025-03-22" },
  { id: 167, Prescriber: "Scott, Karen", ReferralDate: "2021-07-12", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "Cancelled – Patient withdrew", AgingOfStatus: 38, LastComment: "Bridge shipment dispatched, patient notified", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "State of Texas", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "State Medicaid", Territory: "San Francisco CA", Region: "West", Language: "English", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2026-01-10", LastShipDate: "2025-02-19" },
  { id: 168, Prescriber: "Stevens, Donna", ReferralDate: "2025-10-22", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – HCP request", AgingOfStatus: 2, LastComment: "3/4 - Patient recently received a bridge shipment. NCM assistance needed.", LatestHUBSubStatus: "Denial Received", PrimaryChannel: "Commercial", PrimaryPayer: "State of Alabama", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "Seattle WA", Region: "West", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-12-09", LastShipDate: null },
  { id: 169, Prescriber: "Hunter, Michelle", ReferralDate: "2024-07-15", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "W/O shipment processed", AgingOfStatus: 26, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Commercial", PrimaryPayer: "Cigna Health", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Los Angeles East", Region: "West", Language: "Korean", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 170, Prescriber: "Wood, Shirley", ReferralDate: "2025-08-14", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Step therapy", AgingOfStatus: 21, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "W/O Shipment Processed", PrimaryChannel: "State Medicaid", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "OptumRx", SecondaryChannel: "State Medicaid", Territory: "Kansas City MO", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2025-02-12", LastShipDate: "2025-11-22" },
  { id: 171, Prescriber: "Freeman, Amanda", ReferralDate: "2023-02-01", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 45, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Commercial", PrimaryPayer: "Centene Corporation", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "Medicare", Territory: "Western PA/Upstate NY", Region: "Northeast", Language: "Spanish", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2022-03-13", LastShipDate: "2024-09-18" },
  { id: 172, Prescriber: "Gutierrez, Susan", ReferralDate: "2026-07-10", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Insurance issue", AgingOfStatus: 8, LastComment: "W/O shipment processed per HCP request", LatestHUBSubStatus: "Prescriber Decision", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "WS Virtual", Region: "WS Virtual", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2023-03-26", LastShipDate: "2025-12-12" },
  { id: 173, Prescriber: "Young, Steven", ReferralDate: "2025-11-04", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Awaiting decision", AgingOfStatus: 14, LastComment: "Plan requires additional clinical documentation", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Commercial", PrimaryPayer: "Cigna Health", PrimaryPBM: "IngenioRx", SecondaryChannel: null, Territory: "Fort Lauderdale FL", Region: "Southeast", Language: "French", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2023-06-24", LastShipDate: "2026-03-08" },
  { id: 174, Prescriber: "Diaz, Jeffrey", ReferralDate: "2026-10-11", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Step therapy", AgingOfStatus: 25, LastComment: "Patient language barrier – interpreter needed", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "MedImpact", SecondaryChannel: null, Territory: "Phoenix AZ", Region: "West", Language: "French", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 175, Prescriber: "Long, Matthew", ReferralDate: "2023-02-21", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "W/O shipment processed", AgingOfStatus: 6, LastComment: "HCP confirmed appeal submitted to plan", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Commercial", PrimaryPayer: "Centene Corporation", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: "Medicare", Territory: "Charlotte NC", Region: "Southeast", Language: "Spanish", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2025-07-15", LastShipDate: "2026-01-15" },
  { id: 176, Prescriber: "Collins, Scott", ReferralDate: "2022-12-15", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "New referral received", AgingOfStatus: 39, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "Commercial", PrimaryPayer: "State of Alabama", PrimaryPBM: "MedImpact", SecondaryChannel: "Medicare", Territory: "Miami FL", Region: "Southeast", Language: "English", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2025-03-12", LastShipDate: "2025-07-14" },
  { id: 177, Prescriber: "Thomas, Donna", ReferralDate: "2026-03-12", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – Patient request", AgingOfStatus: 24, LastComment: "Requested denial letter from plan", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: "Commercial (Third Party)", Territory: "Wisconsin", Region: "Central", Language: "Portuguese", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-11-13", LastShipDate: null },
  { id: 178, Prescriber: "Walker, Barbara", ReferralDate: "2022-06-25", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Awaiting decision", AgingOfStatus: 45, LastComment: "NCM outreach attempted – no response", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Managed Medicaid", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "DC/Virginia", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: null, LastShipDate: null },
  { id: 179, Prescriber: "Howard, Sandra", ReferralDate: "2022-12-15", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "PA approved – Active", AgingOfStatus: 3, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "PA Submitted", PrimaryChannel: "Medicare", PrimaryPayer: "State of Texas", PrimaryPBM: "IngenioRx", SecondaryChannel: "Commercial (Third Party)", Territory: "Atlanta GA", Region: "Southeast", Language: "French", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2026-12-08", LastShipDate: "2026-05-25" },
  { id: 180, Prescriber: "Gray, Jessica", ReferralDate: "2022-04-26", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 9, LastComment: "PA submitted, awaiting decision from payer", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "Health Exchange", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: "Medicare", Territory: "Ohio Valley", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2021-11-16", LastShipDate: "2026-02-23" },
  { id: 181, Prescriber: "Porter, Kevin", ReferralDate: "2021-07-17", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Appeal submitted", AgingOfStatus: 30, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Health Exchange", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "IngenioRx", SecondaryChannel: null, Territory: "Ohio Valley", Region: "Northeast", Language: "French", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2021-06-08", LastShipDate: null },
  { id: 182, Prescriber: "Hill, Joshua", ReferralDate: "2022-03-18", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 38, LastComment: "Bridge shipment dispatched, patient notified", LatestHUBSubStatus: "Cancelled per Patient Request", PrimaryChannel: "Health Exchange", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "CVS Caremark RX", SecondaryChannel: null, Territory: "North Georgia", Region: "Southeast", Language: "French", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 183, Prescriber: "Thomas, Shirley", ReferralDate: "2025-04-23", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – HCP drafting appeal letter", AgingOfStatus: 10, LastComment: "NCM outreach attempted – no response", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "State Medicaid", PrimaryPayer: "Dept. of Defense - TRICARE", PrimaryPBM: "OptumRx", SecondaryChannel: "Commercial (Third Party)", Territory: "St. Louis MO", Region: "Central", Language: "Korean", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2021-10-12", LastShipDate: "2025-03-22" },
  { id: 184, Prescriber: "Collins, Daniel", ReferralDate: "2021-06-08", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 7, LastComment: "HCP confirmed appeal submitted to plan", LatestHUBSubStatus: "Denial Received", PrimaryChannel: "Commercial", PrimaryPayer: "Blue Cross Blue Shield of Florida", PrimaryPBM: "IngenioRx", SecondaryChannel: "State Medicaid", Territory: "Boston MA", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-06-05", LastShipDate: null },
  { id: 185, Prescriber: "Lee, Andrew", ReferralDate: "2021-06-10", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 35, LastComment: "Requested denial letter from plan", LatestHUBSubStatus: "On Hold - Insurance Issue", PrimaryChannel: "Commercial", PrimaryPayer: "State of Texas", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: "Commercial (Third Party)", Territory: "Detroit MI", Region: "Northeast", Language: "Spanish", HIPPAConsent: "Electronic", ProgramType: "COMM", FirstShipDate: "2025-08-09", LastShipDate: null },
  { id: 186, Prescriber: "Harris, David", ReferralDate: "2026-08-12", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Step therapy", AgingOfStatus: 21, LastComment: "ISS follow-up required – plan not responding", LatestHUBSubStatus: "Reopen - Patient Restarting Therapy", PrimaryChannel: "State Medicaid", PrimaryPayer: "Cigna Health", PrimaryPBM: "IngenioRx", SecondaryChannel: null, Territory: "Kansas City MO", Region: "Central", Language: "Spanish", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2026-07-03", LastShipDate: "2024-09-10" },
  { id: 187, Prescriber: "Reed, George", ReferralDate: "2024-05-21", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Awaiting decision", AgingOfStatus: 4, LastComment: "3/4 - Patient recently received a bridge shipment. NCM assistance needed.", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Health Exchange", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: "Commercial (Third Party)", Territory: "Denver CO", Region: "West", Language: "English", HIPPAConsent: "Written", ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 188, Prescriber: "Rogers, Kenneth", ReferralDate: "2025-01-20", LatestSPPartner: "Accredo", LatestSPStatus: "Pending", LatestSPSubstatus: "PA denied – Medical necessity", AgingOfStatus: 10, LastComment: "Bridge shipment dispatched, patient notified", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Commercial", PrimaryPayer: "Cigna Health", PrimaryPBM: "IngenioRx", SecondaryChannel: null, Territory: "Cincinnati OH", Region: "Northeast", Language: "Portuguese", HIPPAConsent: "Electronic", ProgramType: "COMM", FirstShipDate: "2023-06-15", LastShipDate: "2026-03-17" },
  { id: 189, Prescriber: "Porter, Jeffrey", ReferralDate: "2023-12-15", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "New referral received", AgingOfStatus: 15, LastComment: null, LatestHUBSubStatus: "New Script Received", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "WellCare Health Plans", PrimaryPBM: "MedImpact", SecondaryChannel: null, Territory: "Seattle WA", Region: "West", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2023-12-16", LastShipDate: "2024-02-15" },
  { id: 190, Prescriber: "Long, Melissa", ReferralDate: "2022-03-08", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Reopen – Patient restarting therapy", AgingOfStatus: 45, LastComment: "SP confirmed shipment – bridge active", LatestHUBSubStatus: "New Script Received", PrimaryChannel: "Commercial", PrimaryPayer: "WellCare Health Plans", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: "State Medicaid", Territory: "Dallas TX", Region: "Central", Language: null, HIPPAConsent: "Electronic", ProgramType: "COMM", FirstShipDate: null, LastShipDate: null },
  { id: 191, Prescriber: "Clark, Thomas", ReferralDate: "2025-02-05", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Free goods dispensed", AgingOfStatus: 25, LastComment: "Appeal needs to be submitted by HCP", LatestHUBSubStatus: "Triage to SP", PrimaryChannel: "Commercial (Third Party)", PrimaryPayer: "Express Scripts PBM", PrimaryPBM: "MedImpact", SecondaryChannel: "State Medicaid", Territory: "Charlotte NC", Region: "Southeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2024-08-22", LastShipDate: "2024-09-21" },
  { id: 192, Prescriber: "Powell, Jonathan", ReferralDate: "2025-05-28", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "Free goods dispensed", AgingOfStatus: 6, LastComment: "PA submitted, awaiting decision from payer", LatestHUBSubStatus: "PA Approved - Transitioning to Commercial", PrimaryChannel: "Commercial", PrimaryPayer: "State of Florida", PrimaryPBM: "OptumRx", SecondaryChannel: null, Territory: "Boston MA", Region: "Northeast", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2026-09-09", LastShipDate: null },
  { id: 193, Prescriber: "Webb, Stephanie", ReferralDate: "2026-04-25", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "DC – No HCP response", AgingOfStatus: 36, LastComment: "Verify intent to appeal &/or obtain PA denial letter/appeal documentation", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Commercial", PrimaryPayer: "Centene Corporation", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "North Georgia", Region: "Southeast", Language: "French", HIPPAConsent: "Electronic", ProgramType: "BRIDGE", FirstShipDate: "2021-08-21", LastShipDate: "2026-05-16" },
  { id: 194, Prescriber: "Rivera, Laura", ReferralDate: "2023-12-11", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "2nd level appeal – Appeal submitted", AgingOfStatus: 28, LastComment: "Waiting on HCP to respond to outreach", LatestHUBSubStatus: "Bridge 30+ Days Dispensed", PrimaryChannel: "Medicaid", PrimaryPayer: "State of Alabama", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: null, Territory: "South Texas TX", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "BRIDGE", FirstShipDate: "2022-06-17", LastShipDate: "2025-04-15" },
  { id: 195, Prescriber: "Brooks, Ryan", ReferralDate: "2022-08-17", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "PA submitted – Awaiting decision", AgingOfStatus: 41, LastComment: "W/O shipment processed per HCP request", LatestHUBSubStatus: "No MD Response for Missing Information", PrimaryChannel: "Commercial", PrimaryPayer: "CVS Health (Aetna)", PrimaryPBM: "MedImpact", SecondaryChannel: "Medicaid", Territory: "Los Angeles East", Region: "West", Language: "French", HIPPAConsent: null, ProgramType: null, FirstShipDate: "2023-08-01", LastShipDate: null },
  { id: 196, Prescriber: "Myers, Brenda", ReferralDate: "2025-01-28", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "On hold – HCP request", AgingOfStatus: 7, LastComment: "Patient confirmed receipt of shipment", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Commercial", PrimaryPayer: "State of Alabama", PrimaryPBM: "Humana PBM", SecondaryChannel: null, Territory: "Western PA/Upstate NY", Region: "Northeast", Language: "French", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2023-12-12", LastShipDate: "2025-01-13" },
  { id: 197, Prescriber: "Brooks, Jennifer", ReferralDate: "2022-02-13", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Clinicals needed", AgingOfStatus: 30, LastComment: "SP confirmed shipment – bridge active", LatestHUBSubStatus: "Closed - No HCP response", PrimaryChannel: "Health Exchange", PrimaryPayer: "Centene Corporation", PrimaryPBM: "Express Scripts PBM", SecondaryChannel: "Medicaid", Territory: "Dallas TX", Region: "Central", Language: "Mandarin Chinese", HIPPAConsent: null, ProgramType: "BRIDGE", FirstShipDate: "2023-09-12", LastShipDate: "2024-10-17" },
  { id: 198, Prescriber: "Brown, Melissa", ReferralDate: "2022-07-20", LatestSPPartner: "Biologics", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Awaiting decision", AgingOfStatus: 24, LastComment: "Free goods approved and dispensed", LatestHUBSubStatus: "Trying to Reach Patient", PrimaryChannel: "Commercial", PrimaryPayer: "Dept. of Defense - TRICARE", PrimaryPBM: "MedImpact", SecondaryChannel: "Medicare", Territory: "Manhattan/Brooklyn NY", Region: "Northeast", Language: "Korean", HIPPAConsent: null, ProgramType: "COMM", FirstShipDate: "2025-09-18", LastShipDate: "2026-05-16" },
  { id: 199, Prescriber: "Adams, Robert", ReferralDate: "2024-03-17", LatestSPPartner: "Orsini Specialty Pharmacy", LatestSPStatus: "Pending", LatestSPSubstatus: "1st level appeal – Awaiting decision", AgingOfStatus: 32, LastComment: "Clinicals needed for PA submission", LatestHUBSubStatus: "Product Shipped - Bridge", PrimaryChannel: "Health Exchange", PrimaryPayer: "State of Florida", PrimaryPBM: "Capital Rx PBM", SecondaryChannel: "Commercial (Third Party)", Territory: "Wisconsin", Region: "Central", Language: "English", HIPPAConsent: "Electronic", ProgramType: null, FirstShipDate: null, LastShipDate: null },
  { id: 200, Prescriber: "Evans, Daniel", ReferralDate: "2025-08-28", LatestSPPartner: "PANTHERx Rare", LatestSPStatus: "Pending", LatestSPSubstatus: "Reopen – Patient restarting therapy", AgingOfStatus: 4, LastComment: "Requested denial letter from plan", LatestHUBSubStatus: "No MD Response for Missing Information", PrimaryChannel: "Medicaid", PrimaryPayer: "Dept. of Defense - TRICARE", PrimaryPBM: "Prime Therapeutics", SecondaryChannel: "Medicaid", Territory: "St. Louis MO", Region: "Central", Language: "English", HIPPAConsent: "Written", ProgramType: "COMM", FirstShipDate: "2025-04-18", LastShipDate: "2026-08-17" }

// ─── BUCKET DEFINITIONS & LOGIC ──────────────────────────────────────────────
const BUCKETS = [
  { id: "all",        label: "All Cases",        color: "#4f8ef7" },
  { id: "new",        label: "New Referral",      color: "#a78bfa" },
  { id: "ttrp",       label: "TTRP",              color: "#f472b6" },
  { id: "pa",         label: "Prior Auth (PA)",   color: "#34d399" },
  { id: "appeal",     label: "Appeal",            color: "#f0a500" },
  { id: "onhold",     label: "On Hold",           color: "#94a3b8" },
  { id: "reopen",     label: "Reopen",            color: "#fb923c" },
  { id: "freegoods",  label: "Free Goods",        color: "#2dd4bf" },
  { id: "wo",         label: "W/O Shipment",      color: "#818cf8" },
  { id: "denials",    label: "Denials",           color: "#f87171" },
  { id: "cancelled",  label: "Cancelled / DC",    color: "#6b7280" },
];

function assignBuckets(p) {
  const sub = (p.LatestSPSubstatus || "").toLowerCase();
  const hub = (p.LatestHUBSubStatus || "").toLowerCase();
  const prog = (p.ProgramType || "").toLowerCase();
  const buckets = new Set(["all"]);

  // New Referral — referred very recently (within ~30 days) and no ship date yet
  const daysSinceReferral = p.ReferralDate
    ? Math.floor((new Date("2026-03-08") - new Date(p.ReferralDate)) / 86400000)
    : 9999;
  if (daysSinceReferral <= 30 && !p.FirstShipDate) buckets.add("new");
  if (hub === "new script received") buckets.add("new");

  // TTRP
  if (hub.includes("trying to reach") || hub.includes("no md response") || hub.includes("no hcp response") || hub.includes("hcp follow-up")) buckets.add("ttrp");

  // PA
  if (sub.includes("pa") || sub.includes("prior auth") || hub.includes("pa") || hub.includes("prior auth") || sub.includes("clinicals")) buckets.add("pa");

  // Appeal
  if (sub.includes("appeal") || hub.includes("appeal")) buckets.add("appeal");

  // On Hold
  if (hub.includes("hold") || sub.includes("hold")) buckets.add("onhold");

  // Reopen
  if (hub.includes("reopen") || sub.includes("reopen")) buckets.add("reopen");

  // Free Goods
  if (prog === "bridge" || hub.includes("bridge") || sub.includes("free")) buckets.add("freegoods");

  // W/O Shipment — has shipment activity
  if (p.LastShipDate && !hub.includes("closed") && !hub.includes("cancelled")) buckets.add("wo");

  // Denials
  if (sub.includes("denial") || sub.includes("denied") || hub.includes("denial") || hub.includes("denied")) buckets.add("denials");

  // Cancelled/DC
  if (hub.includes("closed") || hub.includes("cancel") || hub.includes("dc") || sub.includes("cancel")) buckets.add("cancelled");

  // Prescriber Decision edge case
  if (hub.includes("prescriber decision")) buckets.add("ttrp");

  return buckets;
}

// ─── USER STORE ───────────────────────────────────────────────────────────────
const USERS = [
  { id: "ho1", username: "sarah.johnson", password: "pass123", name: "Sarah Johnson", team: "Home Office", role: "admin" },
  { id: "ho2", username: "mike.chen", password: "pass123", name: "Mike Chen", team: "Home Office", role: "admin" },
  { id: "ncm1", username: "lisa.torres", password: "pass123", name: "Lisa Torres", team: "NCM", role: "partner" },
  { id: "ncm2", username: "james.wright", password: "pass123", name: "James Wright", team: "NCM", role: "partner" },
  { id: "sp1", username: "amy.patel", password: "pass123", name: "Amy Patel", team: "SP", role: "partner" },
  { id: "sp2", username: "robert.kim", password: "pass123", name: "Robert Kim", team: "SP", role: "partner" },
  { id: "iss1", username: "diana.reyes", password: "pass123", name: "Diana Reyes", team: "ISS", role: "partner" },
  { id: "iss2", username: "carlos.vega", password: "pass123", name: "Carlos Vega", team: "ISS", role: "partner" },
];

const TEAM_COLORS = {
  "Home Office": { bg: "#1a2744", accent: "#4f8ef7", light: "#e8f0fe" },
  NCM: { bg: "#1a3a2a", accent: "#2ecc71", light: "#e6f9f0" },
  SP: { bg: "#3a1a2a", accent: "#e056b0", light: "#fce8f5" },
  ISS: { bg: "#2a2a1a", accent: "#f0a500", light: "#fff8e1" },
};

const STATUS_COLORS = {
  pending: "#f0a500",
  acknowledged: "#4f8ef7",
  complete: "#2ecc71",
  dismissed: "#888",
};

// ─── STORAGE HELPERS ──────────────────────────────────────────────────────────
async function loadNotifications() {
  try {
    const r = await window.storage.get("aaim_notifications");
    return r ? JSON.parse(r.value) : [];
  } catch { return []; }
}

async function saveNotifications(notifications) {
  try {
    await window.storage.set("aaim_notifications", JSON.stringify(notifications));
  } catch (e) { console.error(e); }
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function initials(name) {
  return name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatDate(d) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function agingColor(days) {
  if (days >= 20) return "#e74c3c";
  if (days >= 10) return "#f0a500";
  return "#2ecc71";
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const handleLogin = () => {
    const user = USERS.find(u => u.username === username && u.password === password);
    if (user) { onLogin(user); }
    else {
      setError("Invalid username or password.");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 30% 40%, #1a2744 0%, transparent 60%), radial-gradient(ellipse at 70% 70%, #1a3a2a 0%, transparent 50%)", pointerEvents: "none" }} />
      <div style={{
        position: "relative", width: 420, padding: "48px 44px", background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16,
        boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
        animation: shake ? "shake 0.4s ease" : "fadeIn 0.6s ease",
      }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, letterSpacing: 4, color: "#4f8ef7", textTransform: "uppercase", marginBottom: 10 }}>AAIM Portal</div>
          <div style={{ fontSize: 28, fontWeight: 700, color: "#fff", letterSpacing: -0.5 }}>Partner Communications</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", marginTop: 8 }}>Secure team collaboration platform</div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            placeholder="Enter username" />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: 8 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && handleLogin()}
            style={{ width: "100%", padding: "12px 16px", background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontSize: 14, outline: "none", boxSizing: "border-box" }}
            placeholder="Enter password" />
        </div>
        {error && <div style={{ fontSize: 13, color: "#e74c3c", marginBottom: 16, textAlign: "center" }}>{error}</div>}
        <button onClick={handleLogin} style={{ width: "100%", padding: "14px", background: "#4f8ef7", border: "none", borderRadius: 8, color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer", letterSpacing: 0.5, transition: "all 0.2s" }}
          onMouseEnter={e => e.target.style.background = "#3a7de0"} onMouseLeave={e => e.target.style.background = "#4f8ef7"}>
          Sign In
        </button>
        <div style={{ marginTop: 24, padding: "16px", background: "rgba(255,255,255,0.04)", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginBottom: 8, letterSpacing: 1 }}>DEMO CREDENTIALS</div>
          {[["Home Office","sarah.johnson"],["NCM","lisa.torres"],["SP","amy.patel"],["ISS","diana.reyes"]].map(([team, user]) => (
            <div key={team} style={{ fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 4 }}>
              <span style={{ color: TEAM_COLORS[team]?.accent || "#fff", fontWeight: 600 }}>{team}:</span> {user} / pass123
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:none}} @keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-8px)}75%{transform:translateX(8px)}} @keyframes pulse{0%{box-shadow:0 0 0 0 currentColor}70%{box-shadow:0 0 0 6px transparent}100%{box-shadow:0 0 0 0 transparent}} @keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

function TeamBadge({ team, size = "sm" }) {
  const c = TEAM_COLORS[team] || { accent: "#888", light: "#eee" };
  const pad = size === "sm" ? "3px 8px" : "5px 12px";
  const fs = size === "sm" ? 11 : 13;
  return (
    <span style={{ padding: pad, background: c.light, color: c.accent, borderRadius: 20, fontSize: fs, fontWeight: 700, letterSpacing: 1 }}>{team}</span>
  );
}

function StatusBadge({ status }) {
  const labels = { pending: "Pending", acknowledged: "Acknowledged", complete: "Complete", dismissed: "Dismissed" };
  const color = STATUS_COLORS[status] || "#888";
  return (
    <span style={{ padding: "3px 10px", background: color + "22", color, borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, border: `1px solid ${color}44` }}>
      {labels[status] || status}
    </span>
  );
}

function AgingBadge({ days }) {
  const color = agingColor(days);
  return (
    <span style={{ padding: "3px 8px", background: color + "22", color, borderRadius: 6, fontSize: 12, fontWeight: 700, border: `1px solid ${color}44` }}>
      {days}d
    </span>
  );
}

function PatientDetailPanel({ patient, currentUser, notifications, onNewNotification, onClose }) {
  const [tab, setTab] = useState("details");
  const [comment, setComment] = useState("");
  const [targetTeam, setTargetTeam] = useState("NCM");
  const [priority, setPriority] = useState("normal");
  const patientNotifs = notifications.filter(n => n.patientId === patient.id).sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));

  const handleSubmit = () => {
    if (!comment.trim()) return;
    const notif = {
      id: Date.now().toString(),
      patientId: patient.id,
      patientName: patient.Prescriber,
      fromTeam: currentUser.team,
      fromUser: currentUser.name,
      toTeam: targetTeam,
      comment: comment.trim(),
      priority,
      status: "pending",
      createdAt: new Date().toISOString(),
      replies: [],
    };
    onNewNotification(notif);
    setComment("");
  };

  const teams = ["NCM", "SP", "ISS", "Home Office"].filter(t => t !== currentUser.team);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ width: "min(860px, 100%)", maxHeight: "90vh", background: "#0f1923", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ padding: "20px 28px", background: "rgba(79,142,247,0.1)", borderBottom: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, color: "#fff" }}>{patient.Prescriber}</div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 3 }}>{patient.Territory} · {patient.Region} · <span style={{ color: agingColor(patient.AgingOfStatus) }}>{patient.AgingOfStatus} days aging</span></div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", fontSize: 22, cursor: "pointer", padding: "4px 10px" }}>✕</button>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 28px" }}>
          {["details", "notifications", "new"].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "14px 20px", background: "none", border: "none", borderBottom: `2px solid ${tab === t ? "#4f8ef7" : "transparent"}`, color: tab === t ? "#4f8ef7" : "rgba(255,255,255,0.5)", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", letterSpacing: 0.5 }}>
              {t === "new" ? "New Notification" : t === "notifications" ? `Activity (${patientNotifs.length})` : "Patient Details"}
            </button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 28 }}>
          {tab === "details" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {[
                ["SP Partner", patient.LatestSPPartner],
                ["SP Status", patient.LatestSPStatus],
                ["SP Substatus", patient.LatestSPSubstatus],
                ["HUB Substatus", patient.LatestHUBSubStatus],
                ["Primary Channel", patient.PrimaryChannel],
                ["Primary Payer", patient.PrimaryPayer],
                ["Primary PBM", patient.PrimaryPBM],
                ["Secondary Channel", patient.SecondaryChannel],
                ["Program Type", patient.ProgramType],
                ["Referral Date", formatDate(patient.ReferralDate)],
                ["First Ship Date", formatDate(patient.FirstShipDate)],
                ["Last Ship Date", formatDate(patient.LastShipDate)],
                ["Language", patient.Language],
                ["HIPAA Consent", patient.HIPPAConsent],
              ].map(([label, val]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.04)", padding: "12px 16px", borderRadius: 8 }}>
                  <div style={{ fontSize: 10, letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
                  <div style={{ fontSize: 14, color: "#fff" }}>{val || "—"}</div>
                </div>
              ))}
              {patient.LastComment && (
                <div style={{ gridColumn: "1/-1", background: "rgba(79,142,247,0.08)", padding: "14px 16px", borderRadius: 8, border: "1px solid rgba(79,142,247,0.2)" }}>
                  <div style={{ fontSize: 10, letterSpacing: 1.5, color: "#4f8ef7", textTransform: "uppercase", marginBottom: 5 }}>Last Comment</div>
                  <div style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.6 }}>{patient.LastComment}</div>
                </div>
              )}
            </div>
          )}
          {tab === "notifications" && (
            <div>
              {patientNotifs.length === 0 ? (
                <div style={{ textAlign: "center", color: "rgba(255,255,255,0.3)", padding: "40px 0", fontSize: 14 }}>No notifications yet for this patient</div>
              ) : patientNotifs.map(n => (
                <NotificationCard key={n.id} notification={n} currentUser={currentUser} onUpdate={onNewNotification} allNotifications={notifications} />
              ))}
            </div>
          )}
          {tab === "new" && (
            <div style={{ maxWidth: 560 }}>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Route To Team</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {teams.map(t => (
                    <button key={t} onClick={() => setTargetTeam(t)} style={{ padding: "8px 20px", background: targetTeam === t ? (TEAM_COLORS[t]?.accent || "#4f8ef7") : "rgba(255,255,255,0.06)", border: `1px solid ${targetTeam === t ? (TEAM_COLORS[t]?.accent || "#4f8ef7") : "rgba(255,255,255,0.15)"}`, borderRadius: 8, color: targetTeam === t ? "#fff" : "rgba(255,255,255,0.6)", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Priority</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[["normal","Normal","#4f8ef7"], ["high","High","#f0a500"], ["urgent","Urgent","#e74c3c"]].map(([v, l, c]) => (
                    <button key={v} onClick={() => setPriority(v)} style={{ padding: "6px 16px", background: priority === v ? c + "22" : "rgba(255,255,255,0.04)", border: `1px solid ${priority === v ? c : "rgba(255,255,255,0.1)"}`, borderRadius: 6, color: priority === v ? c : "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
              <div style={{ marginBottom: 20 }}>
                <label style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", display: "block", marginBottom: 10 }}>Comment / Note</label>
                <textarea value={comment} onChange={e => setComment(e.target.value)} rows={5}
                  style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 8, color: "#fff", fontSize: 14, resize: "vertical", outline: "none", boxSizing: "border-box", lineHeight: 1.6 }}
                  placeholder={`Add a note for the ${targetTeam} team...`} />
              </div>
              <button onClick={handleSubmit} disabled={!comment.trim()} style={{ padding: "12px 32px", background: comment.trim() ? "#4f8ef7" : "rgba(255,255,255,0.1)", border: "none", borderRadius: 8, color: comment.trim() ? "#fff" : "rgba(255,255,255,0.3)", fontSize: 14, fontWeight: 600, cursor: comment.trim() ? "pointer" : "not-allowed" }}>
                Send Notification →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function NotificationCard({ notification: n, currentUser, onUpdate }) {
  const [reply, setReply] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [ackAnim, setAckAnim] = useState(false);

  const isRecipient = currentUser.team === n.toTeam;
  const isSender = currentUser.team === n.fromTeam;
  const canAcknowledge = isRecipient && n.status === "pending";
  // Reply allowed if pending and you're either party, or if there's an open thread
  const canReply = n.status === "pending" || n.status === "replied";

  const handleAcknowledge = () => {
    setAckAnim(true);
    setTimeout(() => {
      const updated = {
        ...n,
        status: "acknowledged",
        acknowledgedAt: new Date().toISOString(),
        acknowledgedBy: currentUser.name,
      };
      onUpdate(updated, true);
    }, 350);
  };

  const submitReply = () => {
    if (!reply.trim()) return;
    const newReply = {
      id: Date.now().toString(),
      text: reply.trim(),
      fromUser: currentUser.name,
      fromTeam: currentUser.team,
      createdAt: new Date().toISOString(),
    };
    const updated = {
      ...n,
      // Keep pending if sender replies back, mark as "replied" if recipient replies
      status: isRecipient ? "replied" : "pending",
      replies: [...(n.replies || []), newReply],
    };
    onUpdate(updated, true);
    setReply("");
    setShowReply(false);
  };

  const priorityColors = { urgent: "#e74c3c", high: "#f0a500", normal: "#4f8ef7" };
  const pc = priorityColors[n.priority] || "#4f8ef7";

  const statusConfig = {
    pending:      { label: "Pending",      color: "#f0a500" },
    replied:      { label: "Reply Sent",   color: "#4f8ef7" },
    acknowledged: { label: "Acknowledged", color: "#2ecc71" },
  };
  const sc = statusConfig[n.status] || statusConfig.pending;

  // Build full thread: original message + all replies in chronological order
  const thread = [
    { id: "orig", text: n.comment, fromUser: n.fromUser, fromTeam: n.fromTeam, createdAt: n.createdAt, isOriginal: true },
    ...(n.replies || []).map(r => ({ ...r, isOriginal: false })),
  ];

  return (
    <div style={{
      background: ackAnim ? "rgba(46,204,113,0.08)" : "rgba(255,255,255,0.04)",
      border: `1px solid ${ackAnim ? "rgba(46,204,113,0.3)" : "rgba(255,255,255,0.08)"}`,
      borderLeft: `3px solid ${n.status === "acknowledged" ? "#2ecc71" : pc}`,
      borderRadius: 10, marginBottom: 12,
      transition: "all 0.35s ease",
      overflow: "hidden",
    }}>
      {/* Header */}
      <div style={{ padding: "14px 18px 10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <TeamBadge team={n.fromTeam} />
          <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>→</span>
          <TeamBadge team={n.toTeam} />
          {n.priority !== "normal" && (
            <span style={{ fontSize: 10, color: pc, fontWeight: 700, letterSpacing: 1, padding: "2px 7px", background: pc + "18", borderRadius: 4 }}>
              {n.priority.toUpperCase()}
            </span>
          )}
        </div>
        <span style={{ padding: "3px 10px", background: sc.color + "18", color: sc.color, borderRadius: 20, fontSize: 11, fontWeight: 700, letterSpacing: 0.5, border: `1px solid ${sc.color}33` }}>
          {sc.label}
        </span>
      </div>

      {/* Thread Trail */}
      <div style={{ padding: "0 18px 14px" }}>
        {thread.map((entry, i) => {
          const entryColor = TEAM_COLORS[entry.fromTeam]?.accent || "#fff";
          const isMe = entry.fromUser === currentUser.name;
          return (
            <div key={entry.id} style={{
              display: "flex", gap: 10, marginBottom: i < thread.length - 1 ? 10 : 0,
            }}>
              {/* Thread line + avatar */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                <div style={{ width: 28, height: 28, borderRadius: "50%", background: entryColor + "22", border: `1.5px solid ${entryColor}55`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: entryColor }}>
                  {initials(entry.fromUser)}
                </div>
                {i < thread.length - 1 && (
                  <div style={{ width: 1, flex: 1, minHeight: 8, background: "rgba(255,255,255,0.08)", marginTop: 3 }} />
                )}
              </div>
              {/* Bubble */}
              <div style={{ flex: 1, paddingBottom: 2 }}>
                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: entryColor }}>{entry.fromUser}</span>
                  <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)" }}>
                    {new Date(entry.createdAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
                  </span>
                  {entry.isOriginal && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontStyle: "italic" }}>original</span>}
                </div>
                <div style={{
                  fontSize: 13, color: "rgba(255,255,255,0.8)", lineHeight: 1.55,
                  background: isMe ? "rgba(79,142,247,0.08)" : "rgba(255,255,255,0.03)",
                  border: `1px solid ${isMe ? "rgba(79,142,247,0.15)" : "rgba(255,255,255,0.06)"}`,
                  borderRadius: 8, padding: "8px 12px",
                }}>
                  {entry.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Acknowledge receipt line */}
      {n.status === "acknowledged" && n.acknowledgedBy && (
        <div style={{ padding: "8px 18px", borderTop: "1px solid rgba(46,204,113,0.15)", background: "rgba(46,204,113,0.06)", fontSize: 11, color: "rgba(46,204,113,0.7)" }}>
          ✓ Acknowledged by {n.acknowledgedBy} · {new Date(n.acknowledgedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
        </div>
      )}

      {/* Actions */}
      {n.status !== "acknowledged" && (
        <div style={{ padding: "10px 18px 14px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          {!showReply ? (
            <div style={{ display: "flex", gap: 8 }}>
              {canAcknowledge && (
                <button onClick={handleAcknowledge} style={{
                  padding: "7px 18px", background: "rgba(46,204,113,0.12)", border: "1px solid rgba(46,204,113,0.35)",
                  borderRadius: 7, color: "#2ecc71", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 0.3,
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(46,204,113,0.22)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(46,204,113,0.12)"; }}>
                  ✓ Acknowledge
                </button>
              )}
              {canReply && (
                <button onClick={() => setShowReply(true)} style={{
                  padding: "7px 18px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 7, color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  transition: "all 0.15s",
                }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "rgba(255,255,255,0.6)"; }}>
                  ↩ Reply
                </button>
              )}
            </div>
          ) : (
            <div>
              <textarea value={reply} onChange={e => setReply(e.target.value)}
                autoFocus rows={3} placeholder="Write your reply…"
                style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 7, color: "#fff", fontSize: 13, resize: "none", outline: "none", boxSizing: "border-box", lineHeight: 1.55, fontFamily: "inherit" }} />
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button onClick={submitReply} disabled={!reply.trim()} style={{ padding: "7px 18px", background: reply.trim() ? "rgba(79,142,247,0.2)" : "rgba(255,255,255,0.04)", border: `1px solid ${reply.trim() ? "rgba(79,142,247,0.4)" : "rgba(255,255,255,0.08)"}`, borderRadius: 7, color: reply.trim() ? "#4f8ef7" : "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 700, cursor: reply.trim() ? "pointer" : "not-allowed" }}>
                  Send Reply
                </button>
                <button onClick={() => { setShowReply(false); setReply(""); }} style={{ padding: "7px 14px", background: "none", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 7, color: "rgba(255,255,255,0.4)", fontSize: 12, cursor: "pointer" }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActionBtn({ label, color, onClick }) {
  return (
    <button onClick={onClick} style={{ padding: "5px 14px", background: color + "18", border: `1px solid ${color}44`, borderRadius: 6, color, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{label}</button>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRegion, setFilterRegion] = useState("All");
  const [filterChannel, setFilterChannel] = useState("All");
  const [view, setView] = useState("dashboard"); // dashboard | inbox
  const [activeBucket, setActiveBucket] = useState("all");
  const [loaded, setLoaded] = useState(false);
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [toasts, setToasts] = useState([]);
  const knownIdsRef = useRef(new Set());
  const userRef = useRef(user);
  useEffect(() => { userRef.current = user; }, [user]);

  // Initial load
  useEffect(() => {
    loadNotifications().then(n => {
      setNotifications(n);
      knownIdsRef.current = new Set(n.map(x => x.id));
      setLoaded(true);
    });
  }, []);

  // 5-second polling for new notifications
  useEffect(() => {
    if (!loaded) return;
    const interval = setInterval(async () => {
      const fresh = await loadNotifications();
      const currentUser = userRef.current;
      if (!currentUser) return;
      // Find genuinely new notifications for this user's team
      const incoming = fresh.filter(n =>
        !knownIdsRef.current.has(n.id) && n.toTeam === currentUser.team
      );
      if (incoming.length > 0) {
        incoming.forEach(n => {
          const patient = PATIENTS.find(p => p.id === n.patientId);
          const toast = {
            id: n.id + "_toast_" + Date.now(),
            message: `New notification from ${n.fromTeam}`,
            detail: `${patient?.Prescriber || "Unknown patient"} · ${n.priority !== "normal" ? n.priority.toUpperCase() + " · " : ""}${n.comment.slice(0, 60)}${n.comment.length > 60 ? "…" : ""}`,
            color: TEAM_COLORS[n.fromTeam]?.accent || "#4f8ef7",
            fromTeam: n.fromTeam,
          };
          setToasts(prev => [...prev, toast]);
          setTimeout(() => setToasts(prev => prev.filter(t => t.id !== toast.id)), 6000);
        });
        // Update known IDs and notification state
        fresh.forEach(n => knownIdsRef.current.add(n.id));
        setNotifications(fresh);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [loaded]);

  const dismissToast = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  const handleNotification = async (notif, isUpdate = false) => {
    let updated;
    if (isUpdate) {
      updated = notifications.map(n => n.id === notif.id ? notif : n);
    } else {
      updated = [notif, ...notifications];
      knownIdsRef.current.add(notif.id); // Don't re-toast your own sends
    }
    setNotifications(updated);
    await saveNotifications(updated);
  };

  const regions = ["All", ...Array.from(new Set(PATIENTS.map(p => p.Region).filter(Boolean)))];
  const channels = ["All", ...Array.from(new Set(PATIENTS.map(p => p.PrimaryChannel).filter(Boolean)))];

  const patientBuckets = new Map(PATIENTS.map(p => [p.id, assignBuckets(p)]));

  const filtered = PATIENTS.filter(p => {
    const matchSearch = !search || p.Prescriber.toLowerCase().includes(search.toLowerCase()) || p.Territory?.toLowerCase().includes(search.toLowerCase()) || p.PrimaryPayer?.toLowerCase().includes(search.toLowerCase());
    const matchRegion = filterRegion === "All" || p.Region === filterRegion;
    const matchChannel = filterChannel === "All" || p.PrimaryChannel === filterChannel;
    const matchBucket = patientBuckets.get(p.id)?.has(activeBucket);
    return matchSearch && matchRegion && matchChannel && matchBucket;
  });

  // Inbox: notifications TO my team that are pending OR replied (replied = ball back in sender's court)
  const myInbox = notifications.filter(n =>
    (n.toTeam === user?.team && n.status === "pending") ||
    (n.fromTeam === user?.team && n.status === "replied")
  );
  const myAllNotifs = notifications.filter(n => n.toTeam === user?.team || n.fromTeam === user?.team);

  if (!user) return <LoginScreen onLogin={setUser} />;

  const tc = TEAM_COLORS[user.team] || TEAM_COLORS["Home Office"];

  return (
    <div style={{ minHeight: "100vh", background: "#0d1117", fontFamily: "'Georgia', serif", color: "#fff" }}>

      {/* Toast Notifications */}
      <div style={{ position: "fixed", bottom: 24, right: 24, zIndex: 999, display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none" }}>
        {toasts.map((t, i) => (
          <div key={t.id} style={{
            pointerEvents: "all", minWidth: 320, maxWidth: 400,
            background: "#0f1923", border: `1px solid ${t.color}55`,
            borderLeft: `4px solid ${t.color}`, borderRadius: 10,
            padding: "14px 16px", boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 20px ${t.color}22`,
            animation: "slideIn 0.3s ease",
            display: "flex", alignItems: "flex-start", gap: 12,
          }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: t.color + "22", border: `1px solid ${t.color}44`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, flexShrink: 0 }}>🔔</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: t.color, marginBottom: 3, letterSpacing: 0.3 }}>{t.message}</div>
              <div style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.detail}</div>
            </div>
            <button onClick={() => dismissToast(t.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.3)", cursor: "pointer", fontSize: 14, padding: "0 2px", flexShrink: 0 }}>✕</button>
          </div>
        ))}
      </div>

      {/* Nav */}
      <nav style={{ background: "rgba(255,255,255,0.03)", borderBottom: "1px solid rgba(255,255,255,0.08)", padding: "0 32px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", letterSpacing: -0.3 }}>
            <span style={{ color: tc.accent }}>AAIM</span> Portal
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {["dashboard", "inbox"].map(v => (
              <button key={v} onClick={() => setView(v)} style={{ padding: "8px 18px", background: view === v ? "rgba(255,255,255,0.08)" : "none", border: "none", borderRadius: 6, color: view === v ? "#fff" : "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: 600, cursor: "pointer", textTransform: "capitalize", position: "relative" }}>
                {v === "inbox" ? "Inbox" : "Dashboard"}
                {v === "inbox" && myInbox.length > 0 && (
                  <span style={{
                    position: "absolute", top: 4, right: 4,
                    width: 8, height: 8, borderRadius: "50%",
                    background: tc.accent,
                    boxShadow: `0 0 0 0 ${tc.accent}`,
                    animation: "pulse 1.8s infinite",
                  }} />
                )}
                {v === "inbox" && myInbox.length > 0 && (
                  <span style={{ marginLeft: 6, background: tc.accent, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "1px 6px" }}>{myInbox.length}</span>
                )}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <TeamBadge team={user.team} size="md" />
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: tc.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700 }}>{initials(user.name)}</div>
          <button onClick={() => setUser(null)} style={{ background: "none", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 6, color: "rgba(255,255,255,0.5)", fontSize: 12, padding: "6px 12px", cursor: "pointer" }}>Sign Out</button>
        </div>
      </nav>

      <div style={{ padding: "28px 32px" }}>
        {view === "dashboard" && (
          <>
            {/* Bucket Filter Bar */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 10, letterSpacing: 2, color: "rgba(255,255,255,0.3)", textTransform: "uppercase", marginBottom: 12 }}>Case Stage / Bucket</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {BUCKETS.map(b => {
                  const count = PATIENTS.filter(p => patientBuckets.get(p.id)?.has(b.id)).length;
                  const isActive = activeBucket === b.id;
                  return (
                    <button key={b.id} onClick={() => setActiveBucket(b.id)} style={{
                      padding: "8px 16px", borderRadius: 8, border: `1.5px solid ${isActive ? b.color : "rgba(255,255,255,0.1)"}`,
                      background: isActive ? b.color + "22" : "rgba(255,255,255,0.03)",
                      color: isActive ? b.color : "rgba(255,255,255,0.5)",
                      fontSize: 12, fontWeight: isActive ? 700 : 500, cursor: "pointer",
                      display: "flex", alignItems: "center", gap: 7,
                      transition: "all 0.15s", whiteSpace: "nowrap",
                      boxShadow: isActive ? `0 0 12px ${b.color}33` : "none",
                    }}
                      onMouseEnter={e => { if (!isActive) { e.currentTarget.style.borderColor = b.color + "66"; e.currentTarget.style.color = b.color + "cc"; }}}
                      onMouseLeave={e => { if (!isActive) { e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"; e.currentTarget.style.color = "rgba(255,255,255,0.5)"; }}}>
                      {b.label}
                      <span style={{
                        background: isActive ? b.color : "rgba(255,255,255,0.1)",
                        color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                        borderRadius: 20, fontSize: 10, fontWeight: 700,
                        padding: "1px 7px", minWidth: 20, textAlign: "center",
                        transition: "all 0.15s",
                      }}>{count}</span>
                    </button>
                  );
                })}
              </div>
            </div>
            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 28 }}>
              {[
                ["Showing", filtered.length, "#4f8ef7"],
                ["Active Notifications", notifications.filter(n => n.status === "pending").length, "#f0a500"],
                ["My Inbox", myInbox.length, tc.accent],
                ["Avg Aging", Math.round(PATIENTS.reduce((a, p) => a + p.AgingOfStatus, 0) / PATIENTS.length) + "d", agingColor(Math.round(PATIENTS.reduce((a,p)=>a+p.AgingOfStatus,0)/PATIENTS.length))],
              ].map(([label, val, color]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderTop: `2px solid ${color}`, borderRadius: 10, padding: "16px 20px" }}>
                  <div style={{ fontSize: 26, fontWeight: 700, color }}>{val}</div>
                  <div style={{ fontSize: 12, color: "rgba(255,255,255,0.45)", marginTop: 4, letterSpacing: 0.5 }}>{label}</div>
                </div>
              ))}
            </div>
            {/* Filters */}
            <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search prescriber, territory, payer..."
                style={{ flex: "1 1 240px", padding: "10px 16px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }} />
              <select value={filterRegion} onChange={e => setFilterRegion(e.target.value)}
                style={{ padding: "10px 14px", background: "#1a2030", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }}>
                {regions.map(r => <option key={r} value={r}>{r === "All" ? "All Regions" : r}</option>)}
              </select>
              <select value={filterChannel} onChange={e => setFilterChannel(e.target.value)}
                style={{ padding: "10px 14px", background: "#1a2030", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontSize: 13, outline: "none" }}>
                {channels.map(c => <option key={c} value={c}>{c === "All" ? "All Channels" : c}</option>)}
              </select>
            </div>
            {/* Table */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "rgba(255,255,255,0.04)" }}>
                    {["Prescriber", "Territory / Region", "SP Partner", "HUB Substatus", "Payer", "Channel", "Aging", "Notifications", ""].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 10, letterSpacing: 1.5, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 600, borderBottom: "1px solid rgba(255,255,255,0.08)", whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p, i) => {
                    const pNotifs = notifications.filter(n => n.patientId === p.id);
                    const pendingCount = pNotifs.filter(n =>
                      (n.toTeam === user.team && n.status === "pending") ||
                      (n.fromTeam === user.team && n.status === "replied")
                    ).length;
                    return (
                      <tr key={p.id} style={{ borderBottom: "1px solid rgba(255,255,255,0.05)", transition: "background 0.15s", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        onClick={() => setSelectedPatient(p)}>
                        <td style={{ padding: "13px 16px", fontSize: 13, fontWeight: 600, color: "#fff" }}>{p.Prescriber}</td>
                        <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{p.Territory}<br/><span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{p.Region}</span></td>
                        <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{p.LatestSPPartner || "—"}</td>
                        <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)", maxWidth: 160 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.LatestHUBSubStatus || "—"}</div></td>
                        <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)", maxWidth: 140 }}><div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.PrimaryPayer || "—"}</div></td>
                        <td style={{ padding: "13px 16px", fontSize: 12, color: "rgba(255,255,255,0.6)" }}>{p.PrimaryChannel || "—"}</td>
                        <td style={{ padding: "13px 16px" }}><AgingBadge days={p.AgingOfStatus} /></td>
                        <td style={{ padding: "13px 16px" }}>
                          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                            {pendingCount > 0 && <span style={{ background: tc.accent, color: "#fff", borderRadius: 10, fontSize: 11, fontWeight: 700, padding: "2px 7px" }}>{pendingCount} new</span>}
                            {pNotifs.length > 0 && <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 11 }}>{pNotifs.length} total</span>}
                          </div>
                        </td>
                        <td style={{ padding: "13px 16px" }}>
                          <button onClick={e => { e.stopPropagation(); setSelectedPatient(p); }} style={{ padding: "5px 14px", background: "rgba(79,142,247,0.15)", border: "1px solid rgba(79,142,247,0.3)", borderRadius: 6, color: "#4f8ef7", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Open →</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}

        {view === "inbox" && (
          <div style={{ maxWidth: 760 }}>
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 22, fontWeight: 700, marginBottom: 4 }}>Team Inbox</div>
              <div style={{ fontSize: 13, color: "rgba(255,255,255,0.4)" }}>
                Active notifications for <TeamBadge team={user.team} /> — acknowledge to clear, reply to continue the thread
              </div>
            </div>

            {/* Needs Action */}
            {myInbox.length === 0 ? (
              <div style={{ textAlign: "center", padding: "48px 0", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, marginBottom: 28 }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>✓</div>
                <div style={{ fontSize: 15, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>All caught up</div>
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.25)", marginTop: 4 }}>No notifications need your attention right now</div>
              </div>
            ) : (
              <div style={{ marginBottom: 32 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                  <div style={{ fontSize: 11, letterSpacing: 2, color: tc.accent, textTransform: "uppercase", fontWeight: 700 }}>Needs Your Action</div>
                  <span style={{ background: tc.accent, color: "#fff", borderRadius: 10, fontSize: 10, fontWeight: 700, padding: "2px 8px" }}>{myInbox.length}</span>
                </div>
                {myInbox.map(n => {
                  const patient = PATIENTS.find(p => p.id === n.patientId);
                  const isReply = n.fromTeam === user.team && n.status === "replied";
                  return (
                    <div key={n.id} style={{ marginBottom: 16 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                        <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{patient?.Prescriber}</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>·</span>
                        <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{patient?.Territory}</span>
                        {isReply && <span style={{ fontSize: 10, color: "#4f8ef7", background: "rgba(79,142,247,0.12)", border: "1px solid rgba(79,142,247,0.25)", borderRadius: 4, padding: "1px 7px", fontWeight: 700 }}>REPLY RECEIVED</span>}
                      </div>
                      <NotificationCard notification={n} currentUser={user} onUpdate={(updated) => handleNotification(updated, true)} />
                    </div>
                  );
                })}
              </div>
            )}

            {/* All Activity — collapsed by default */}
            {myAllNotifs.length > 0 && (
              <div>
                <button
                  onClick={() => setShowAllActivity(v => !v)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10, width: "100%",
                    background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: showAllActivity ? "10px 10px 0 0" : 10,
                    padding: "13px 18px", cursor: "pointer", transition: "background 0.15s",
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.06)"}
                  onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.03)"}
                >
                  <span style={{ fontSize: 11, letterSpacing: 2, color: "rgba(255,255,255,0.4)", textTransform: "uppercase", fontWeight: 700, flex: 1, textAlign: "left" }}>
                    All Activity
                  </span>
                  <span style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", background: "rgba(255,255,255,0.07)", borderRadius: 10, padding: "2px 8px", fontWeight: 600 }}>
                    {myAllNotifs.length} notifications
                  </span>
                  <span style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginLeft: 4, transition: "transform 0.2s", display: "inline-block", transform: showAllActivity ? "rotate(180deg)" : "none" }}>
                    ▾
                  </span>
                </button>
                {showAllActivity && (
                  <div style={{ border: "1px solid rgba(255,255,255,0.08)", borderTop: "none", borderRadius: "0 0 10px 10px", padding: "16px 0 4px" }}>
                    {myAllNotifs.map(n => {
                      const patient = PATIENTS.find(p => p.id === n.patientId);
                      return (
                        <div key={n.id} style={{ marginBottom: 16, padding: "0 16px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>{patient?.Prescriber}</span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)" }}>·</span>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{patient?.Territory}</span>
                          </div>
                          <NotificationCard notification={n} currentUser={user} onUpdate={(updated) => handleNotification(updated, true)} />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {selectedPatient && (
        <PatientDetailPanel
          patient={selectedPatient}
          currentUser={user}
          notifications={notifications}
          onNewNotification={(notif, isUpdate) => handleNotification(notif, isUpdate)}
          onClose={() => setSelectedPatient(null)}
        />
      )}
    </div>
  );
}
