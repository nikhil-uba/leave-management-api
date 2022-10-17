# leave-management-api

# how does the system work?

1. The database is populated with Users and Admins at the very start.
2. The added emails and passwords will be given to the employees
3. The employees login and create their profile providing the required informations correctly.
4. Their leave count gets added as default to 25 days (sick + casual leaves)

# what can employees do?

1. The employees can update their profile as and when needed.
2. They can take a leave given they still have remaining leave days.
3. They can view their leave histories (leaves they have taken)
4. They can see their remaining leave days.

# what can an admin do?

1. Admins can do everything the employees can
2. They can delete employees profiles.
3. They can add a new user
4. They can add an admin

# what the system does

1. controls the database
2. when an employee takes a leave, its sends the leave reasons as email to whom they've sent it to.
3. The same mail will be cced to their teammates
