"use strict";(self.webpackChunk=self.webpackChunk||[]).push([[183],{2183:(e,t,o)=>{o.r(t),o.d(t,{default:()=>a});const a={BioSample:{fileType:"xls",status:"published",method:function(e){const t=new Map([["sample_name",[]],["bioproject_accession",[]],["attribute_package",[]],["GISAID_accession",[]],["GISAID_virus_name",[]],["collection_date",[]],["collected_by",[]],["sequenced_by",[]],["sequence_submitted_by",[]],["geo_loc_name",["geo_loc_name (country)","geo_loc_name (province/territory)"]],["organism",[]],["isolate",[]],["isolation_source",["anatomical material","anatomical part","body product","environmental material","environmental site","collection device","collection method"]],["anatomical_material",[]],["anatomical_part",[]],["body_product",[]],["environmental_material",[]],["environmental_site",[]],["collection_device",[]],["collection_method",[]],["lab_host",[]],["passage_history",[]],["passage_method",[]],["host",[]],["host_disease",[]],["host_health_state",[]],["host_disease_outcome",[]],["host_age",[]],["host_age_unit",[]],["host_age_bin",[]],["host_sex",[]],["host_subject_id",[]],["purpose_of_sampling",[]],["purpose_of_sequencing",[]],["gene_name_1",[]],["diagnostic_PCR_CT_value_1",[]],["gene_name_2",[]],["diagnostic_PCR_CT_value_2",[]],["description",[]]]),o=e.getFields(e.table),a=e.getFieldNameMap(o);e.getHeaderMap(t,o,"BIOSAMPLE");const s=[[...t.keys()]];for(const _ of e.getTrimmedData(e.hot)){const n=[];for(const[s,i]of t){const t=e.getMappedField(s,_,i,o,a,":","BIOSAMPLE");n.push(t)}s.push(n)}return s}},GISAID:{fileType:"xls",status:"published",method:function(e){const t=[["Submitter",[]],["FASTA filename",[]],["Virus name",[]],["Passage details/history",[]],["Collection date",[]],["Location",[]],["Additional location information",[]],["Host",[]],["Additional host information",[]],["Sampling Strategy",[]],["Gender",[]],["Patient age",[]],["Patient status",[]],["Specimen source",[]],["Outbreak",[]],["Last vaccinated",[]],["Treatment",[]],["Sequencing technology",[]],["Assembly method",[]],["Depth of coverage",["depth_of_coverage_value"]],["Originating lab",[]],["Address",["sample_collector_contact_address"]],["Sample ID given by the sample provider",[]],["Submitting lab",[]],["Address",["sequence_submitter_contact_address"]],["Sample ID given by the submitting laboratory",["specimen_collector_sample_id"]],["Authors",[]]],o=e.getFields(e.table),a=e.getFieldNameMap(o);e.getHeaderMap(t,o,"GISAID");const s=[Array.from(t,(e=>e[0]))];for(const _ of e.getTrimmedData(e.hot)){const e=[];for(const[s]of t.entries()){const n=t[s][0],i=t[s][1];if("Type"===n){e.push("betacoronavirus");continue}const c=[];for(const e of i){let t=a[e],s=_[t];if(!s)continue;const n=o[t],l=s.toLowerCase().trim();if("specimen processing"===n.fieldName){if(!l.split(";").includes("virus passage"))continue;s="Virus passage"}if(n.dataStatus&&n.dataStatus.map((e=>e.toLowerCase().trim())).includes(l)){if(i.length>1)continue;s="Unknown"}"passage number"===n.fieldName&&(s="passage number "+s),c.push(s)}"Assembly method"===n?e.push(c.join(" ")):e.push(c.join(";"))}s.push(e)}return s.splice(0,0,["submitter","fn","pox_virus_name","pox_passage","pox_collection_date","pox_location","pox_add_location","pox_host","pox_add_host_info","pox_sampling_strategy","pox_gender","pox_patient_age","pox_patient_status","pox_specimen","pox_outbreak","pox_last_vaccinated","pox_treatment","pox_seq_technology","pox_assembly_method","pox_coverage","pox_orig_lab","pox_orig_lab_addr","pox_provider_sample_id","pox_subm_lab","pox_subm_lab_addr","pox_subm_sample_id","pox_authors"]),s}},"NML LIMS":{fileType:"csv",pertains_to:["Mpox"],status:"published",method:function(e){const t=new Map([["TEXT_ID",[]],["PH_CASE_ID",[]],["PH_RELATED_PRIMARY_ID",[]],["CUSTOMER",[]],["PH_SEQUENCING_CENTRE",[]],["PH_SEQUENCE_SUBMITTER",[]],["HC_COLLECT_DATE",[]],["HC_TEXT2",[]],["HC_COUNTRY",[]],["HC_PROVINCE",[]],["HC_CURRENT_ID",[]],["SUBMISSIONS - BioProject Accession",[]],["SUBMISSIONS - BioSample Accession",[]],["SUBMISSIONS - SRA Accession",[]],["SUBMISSIONS - GenBank Accession",[]],["SUBMISSIONS - GISAID Virus Name",[]],["SUBMISSIONS - GISAID Accession",[]],["HC_SAMPLE_CATEGORY",[]],["PH_SAMPLING_DETAILS",[]],["PH_SPECIMEN_TYPE",[]],["PH_RELATED_RELATIONSHIP_TYPE",[]],["PH_ISOLATION_SITE_DESC",[]],["PH_ISOLATION_SITE",[]],["PH_SPECIMEN_SOURCE",[]],["PH_SPECIMEN_SOURCE_DESC",[]],["PH_SPECIMEN_TYPE_ORIG",[]],["COLLECTION_METHOD",[]],["PH_ANIMAL_TYPE",[]],["PH_HOST_HEALTH",[]],["PH_HOST_HEALTH_DETAILS",[]],["PH_HOST_HEALTH_OUTCOME",[]],["PH_HOST_DISEASE",[]],["PH_AGE",[]],["PH_AGE_UNIT",[]],["PH_AGE_GROUP",[]],["VD_SEX",[]],["PH_HOST_COUNTRY",[]],["PH_HOST_PROVINCE",[]],["HC_ONSET_DATE",[]],["HC_SYMPTOMS",[]],["PH_VACCINATION_HISTORY",[]],["VE_SYMP_AVAIL",[]],["PH_EXPOSURE_COUNTRY",[]],["PH_TRAVEL",[]],["PH_EXPOSURE",[]],["PH_EXPOSURE_DETAILS",[]],["PH_HOST_ROLE",[]],["PH_REASON_FOR_SEQUENCING",[]],["PH_REASON_FOR_SEQUENCING_DETAILS",[]],["PH_SEQUENCING_DATE",[]],["PH_LIBRARY_PREP_KIT",[]],["PH_SEQUENCING_INSTRUMENT",[]],["PH_TESTING_PROTOCOL",[]],["PH_RAW_SEQUENCE_METHOD",[]],["PH_DEHOSTING_METHOD",[]],["PH_CONSENSUS_SEQUENCE",[]],["PH_CONSENSUS_SEQUENCE_VERSION",[]],["PH_BIOINFORMATICS_PROTOCOL",[]],["SUBMITTED_RESLT - Gene Target #1",[]],["SUBMITTED_RESLT - Gene Target #1 CT Value",[]],["SUBMITTED_RESLT - Gene Target #2",[]],["SUBMITTED_RESLT - Gene Target #2 CT Value",[]],["SUBMITTED_RESLT - Gene Target #3",[]],["SUBMITTED_RESLT - Gene Target #3 CT Value",[]],["SUBMITTED_RESLT - Gene Target #4",[]],["SUBMITTED_RESLT - Gene Target #4 CT Value",[]],["SUBMITTED_RESLT - Gene Target #5",[]],["SUBMITTED_RESLT - Gene Target #5 CT Value",[]],["PH_SEQUENCING_AUTHORS",[]],["HC_COMMENTS",[]],["sample collector contact email",[]],["sample collector contact address",[]],["sequenced by contact email",[]],["sequenced by contact address",[]],["sequence submitter contact email",[]],["sequence submitter contact address",[]],["sample received date",[]],["host (scientific name)",[]],["geo_loc_name (city)",[]],["breadth of coverage value",[]],["depth of coverage value",[]],["depth of coverage threshold",[]],["number of base pairs sequenced",[]],["consensus genome length",[]]]),o=e.getFields(e.table),a=e.getFieldNameMap(o),s=e.getFieldTitleMap(o);e.getHeaderMap(t,o,"NML_LIMS");const _=[[...t.keys()]],n=new Map([["not applicable","Not Applicable"],["missing","Missing"],["not collected","Not Collected"],["not provided","Not Provided"],["restricted access","Restricted Access"]]),i=new Set(["Not Applicable","Missing","Not Collected","Not Provided","Restricted Access"]);for(const c of e.getTrimmedData(e.hot)){const l=[];for(const[_,r]of t){if("HC_CURRENT_ID"===_){l.push("Monkeypox virus");continue}if("VE_SYMP_AVAIL"===_){const e=c[s["signs and symptoms"]]||"";l.push(e?"Y":"N");continue}if("HC_COLLECT_DATE"===_){let t=c[s["sample collection date"]]||"";const o=c[s["sample collection date precision"]];l.push(e.setDateChange(o,t,"01"));continue}if("PH_SPECIMEN_SOURCE"===_){let e="";for(const t of["host (scientific name)","host (common name)","environmental material","environmental site"]){const o=c[s[t]];if(o&&!i.has(o)){if("host (scientific name)"===t||"host (common name)"===t){e="Homo sapiens"===o||"Human"===o?"Human":"ANIMAL";break}if("environmental material"===t||"environmental site"===t){e="ENVIRO";break}}}l.push(e);continue}let t=e.getMappedField(_,c,r,o,a,";","NML_LIMS"),S=t.split(";");if(S=S.map((t=>e.fixNullOptionCase(t.trim(),n))),S.length>1){let e=new Set(S);i.forEach(Set.prototype.delete,e),0==e.size&&(e=new Set(S)),S=[...e]}t=S.join(";"),l.push(t)}_.push(l)}return _}}}}}]);