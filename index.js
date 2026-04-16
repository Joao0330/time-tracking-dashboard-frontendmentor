const dashboardWrapper = document.querySelector('.dashboard__wrapper');
const filterBtns = document.querySelectorAll('li button');

const fetchCards = async () => {
	try {
		const response = await fetch('./data.json');

		if (!response.ok) {
			throw new Error('Could not fetch resource');
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching', error);
		return [];
	}
};

const displayCards = async (type = 'weekly') => {
	try {
		const data = await fetchCards();
		let currentTimeframe;
		let previousText;
		let cardClass;

		dashboardWrapper.innerHTML = '';

		data.forEach(card => {
			switch (type) {
				case 'daily':
					currentTimeframe = card.timeframes.daily;
					previousText = 'Yesterday';
					break;
				case 'weekly':
					currentTimeframe = card.timeframes.weekly;
					previousText = 'Last week';
					break;
				case 'monthly':
					currentTimeframe = card.timeframes.monthly;
					previousText = 'Last Month';
					break;
			}

			switch (card.title) {
				case 'Work':
					cardClass = 'work';
					break;
				case 'Play':
					cardClass = 'play';
					break;
				case 'Study':
					cardClass = 'study';
					break;
				case 'Exercise':
					cardClass = 'exercise';
					break;
				case 'Social':
					cardClass = 'social';
					break;
				case 'Self Care':
					cardClass = 'selfCare';
					break;
			}

			dashboardWrapper.innerHTML += `
                <article class="card ${cardClass}">
						<div class="card__image" aria-hidden="true"></div>
							<div class="card__content">
								<div class="card__content-title">
									<h3>${card.title}</h3>
									<button type="button">
										<svg width="21" height="5" xmlns="http://www.w3.org/2000/svg">
											<path d="M2.5 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Zm8 0a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5Z" fill="#BBC0FF" fill-rule="evenodd" />
										</svg>
									</button>
								</div>

								<div class="card__content-hours">
									<strong>${currentTimeframe.current}hrs</strong>
									<p>${previousText} - ${currentTimeframe.previous}hrs</p>
								</div>
						    </div>
				</article>
            `;
		});
	} catch (error) {
		console.error(error);
	}
};

// Initialize on page load
window.addEventListener('load', () => {
	displayCards();
});

filterBtns.forEach(btn => {
	btn.addEventListener('click', () => {
		const timeframe = btn.id;
		displayCards(timeframe);
	});
});
