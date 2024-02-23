export interface NotificationClaims { // this comes from fuel_notifier
    data: {
        car_name: string,
        car_id: string,
        tank_size: number,
        consumption: number,
        owner: string
    }
}