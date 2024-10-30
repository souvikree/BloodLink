package com.example.bloodlinkapplication.GetData

import com.example.bloodlinkapplication.R
import com.example.bloodlinkapplication.dateClass.BloodRequest
import com.example.bloodlinkapplication.dateClass.Services
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
        "https://tse4.mm.bing.net/th?id=OIG4.EDX7MhIs_W846eQdCwIB&pid=ImgGn"
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
        "https://tse3.mm.bing.net/th?id=OIG2.jHjvInQHA7NJSe7C3px0&pid=ImgGn"
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
        "https://tse1.mm.bing.net/th?id=OIG3.NAr5M.oFvPTePGcq0sfm&pid=ImgGn"
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
        "https://tse2.mm.bing.net/th?id=OIG4.Dt4E1aQZ7lnLGSn7vNSC&pid=ImgGn"
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
        "https://tse2.mm.bing.net/th?id=OIG1.J3DOzS2I4oXIQ5hKasDd&pid=ImgGn"
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
            "https://tse3.mm.bing.net/th?id=OIG2.0Pse951xzb_uHJlC7yoV&pid=ImgGn"
        )
    }

)
val servicesList = listOf(
    Services(
        title = "Find Donor",
        description = "Instantly check real-time blood availability and nearby blood banks.",
        image = R.drawable.bloodsearchicon // Replace with your drawable resource
    ),
    Services(
        title = "Filter Blood",
        description = "Quickly locate the required blood type with advanced filters.",
        image = R.drawable.filter_icon // Replace with your drawable resource
    ),
    Services(
        title = "Locate Help",
        description = "View nearest blood banks and donors within a 7 km radius.",
        image = R.drawable.baseline_help_24 // Replace with your drawable resource
    ),
    Services(
        title = "Track Orders",
        description = "Track your blood order from request to delivery with updates.",
        image = R.drawable.blood_delivery_icon // Replace with your drawable resource
    ),
    Services(
        title = "Reliable Delivery",
        description = "Admin-coordinated secure blood transport for fast delivery.",
        image = R.drawable.blood_donation_icon // Replace with your drawable resource
    ),
    Services(
        title = "Join Community",
        description = "Patients, donors, and blood banks enjoy seamless onboarding.",
        image = R.drawable.blood_bank_community // Replace with your drawable resource
    )
)
