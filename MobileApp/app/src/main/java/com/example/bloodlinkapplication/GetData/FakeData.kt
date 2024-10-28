package com.example.bloodlinkapplication.GetData

import com.example.bloodlinkapplication.dateClass.BloodRequest
import java.sql.Time
import java.text.SimpleDateFormat
import java.util.Locale

val formatter = SimpleDateFormat("yyyy-MM-dd", Locale.US)
val bloodRequestsFakeData = listOf(
    formatter.parse("2024-10-28")?.let {
        BloodRequest(
        "John Doe",
        35,
        "Male",
        "A+",
            it,
        Time(10, 30, 0),
        "John's Family",
        "Urgent",
        "BLD-001",
        "New York City, NY",
        "https://www.publicpreviews.com/stock-images/blood-donation-campaign-social-media-post-template-158438895.jpg"
    )
    },
    formatter.parse("2024-10-25")?.let {
        BloodRequest(
        "Jane Smith",
        28,
        "Female",
        "O-",
            it,
        Time(15, 0, 0),
        "Jane's Hospital",
        "Critical",
        "BLD-002",
        "Los Angeles, CA",
        "https://www.redcrossblood.org/content/dam/redcrossblood/blood-types/blood-donation-type-o-neg.jpg"
    )
    },
    formatter.parse("2024-10-27")?.let {
        BloodRequest(
        "Michael Brown",
        42,
        "Male",
        "B+",
            it,
        Time(12, 15, 0),
        "Michael's Friends",
        "High Priority",
        "BLD-003",
        "Chicago, IL",
        "https://www.shutterstock.com/shutterstock/photos/2520821829/display_1500/stock-photo-halloween-pumpkin-on-abandoned-old-road-and-medieval-castle-on-the-background-2520821829.jpg"
    )
    },
    formatter.parse("2024-10-24")?.let {
        BloodRequest(
        "Sarah Jones",
        19,
        "Female",
        "AB-",
            it,
        Time(9, 0, 0),
        "Sarah's Family",
        "Urgent",
        "BLD-004",
        "Miami, FL",
        "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*w7fSHgKimriL-ryZJ52Uig.png"
    )
    },
    formatter.parse("2024-10-26")?.let {
        BloodRequest(
        "David Lee",
        65,
        "Male",
        "A-",
            it,
        Time(17, 30, 0),
        "David's Clinic",
        "Critical",
        "BLD-005",
        "Houston, TX",
        "https://www.nhs.uk/conditions/blood-donations/why-donate-blood/"
    )
    },
    formatter.parse("2024-10-23")?.let {
        BloodRequest(
        "Emily Garcia",
        30,
        "Female",
        "B-",
            it,
        Time(14, 0, 0),
        "Emily's Community Center",
        "High Priority",
        "BLD-006",
        "Phoenix, AZ",
        "https://www.versiti.org/blood-donation/blood-drives"
    )
    },
    formatter.parse("2024-10-22")?.let {
        BloodRequest(
            "William Miller",
            58,
            "Male",
            "AB+",
            it,
            Time(8, 45, 0),
            "William's Hospital",
            "Urgent",
            "BLD-007",
            "Seattle, WA",
            "https://www.blood.ca/en/blood-donors/give-blood/eligibility"
        )
    }
)
