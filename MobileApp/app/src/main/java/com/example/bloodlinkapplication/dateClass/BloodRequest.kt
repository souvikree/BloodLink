package com.example.bloodlinkapplication.dateClass

import java.sql.Time
import java.util.Date

data class BloodRequest(
    val patientName:String,
    val patientAge:Int,
    val patientGender:String,
    val bloodGroup:String,
    val requestDate:Date,
    val requestTime:Time,
    val requestBy:String,
    val status:String,
    val requestID:String,
    val location:String,
    val image:String,
)
