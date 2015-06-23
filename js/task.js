import Backbone from 'backbone'

/*  Task {
	[string] title 
	[Date] due_date
	[Lat,lng] location
	Boolean isDone
	Boolean isStarted

	String progress --> [ done, started, cancelled, upcoming]

	Boolean isUrgent
}
*/





export const Task = Backbone.Model.extend({
	className:'Task',
	defaults: {
		title: ('no title'),
		due_date: null,
		location: null,
		progress: 'upcoming',
		isUrgent: false
	}
})

export const Tasks = Backbone.Collection.extend({
	model: Task
})