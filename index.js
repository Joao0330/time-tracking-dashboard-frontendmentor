const dashboardWrapper = document.querySelector('.dashboard__wrapper');
const filterBtns = document.querySelectorAll('li button');

let cachedData = [];

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
		if (cachedData.length === 0) {
			cachedData = await fetchCards();
		}

		const data = cachedData;

		let cardHtml = '';

		filterBtns.forEach(btn => {
			btn.classList.remove('active');
			btn.id === type ? btn.classList.add('active') : '';
		});

		data.forEach(card => {
			const timeframeMap = {
				daily: { label: 'Yesterday' },
				weekly: { label: 'Last week' },
				monthly: { label: 'Last Month' },
			};

			const classMap = {
				work: 'work',
				play: 'play',
				study: 'study',
				exercise: 'exercise',
				social: 'social',
				'self care': 'selfCare',
			};

			const currentTimeframe = card.timeframes[type];
			const previousText = timeframeMap[type].label;
			const cardClass = classMap[card.title.toLowerCase()];

			cardHtml += `
                <article class="card ${cardClass}">
						<div class="card__image" aria-hidden="true"></div>
							<div class="card__content">
								<div class="card__content-title">
									<h2>${card.title}</h2>
									<button type="button">
										<span class="sr-only">Options</span>
										<svg width="21" height="5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
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

			dashboardWrapper.innerHTML = cardHtml;
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
		filterBtns.forEach(b => b.setAttribute('aria-pressed', 'false'));
		btn.setAttribute('aria-pressed', 'true');
		const timeframe = btn.id;
		displayCards(timeframe);
	});
});
