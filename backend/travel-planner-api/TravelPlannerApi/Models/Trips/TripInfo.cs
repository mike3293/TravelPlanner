﻿namespace TravelPlannerApi.Models.Trips;

public class TripInfo
{
    public required string Id { get; set; }

    public required string Name { get; set; }

    public DateOnly StartDate { get; set; } 

    public DateOnly EndDate { get; set; }
}