import { useMemo, useState } from 'react';
import {
  businessCounters,
  businessServiceTypes,
  cityOptions,
  conditionOptions,
  extraOptions,
  frequencyOptions,
  getCityOption,
  getConditionOption,
  getExtraOption,
  getFrequencyOption,
  getMaterialOption,
  getPetOption,
  getServiceType,
  getSizeOption,
  getUrgencyOption,
  materialOptions,
  petOptions,
  quoteConfig,
  residentialCounters,
  serviceTypes,
  sizeOptions,
  urgencyOptions,
} from '../data/quoteContent';

const singleQuantityExtras = new Set([
  'heavyGrease',
  'highDust',
  'lightTrash',
  'odorDetail',
  'delicateSurfaces',
  'difficultAccess',
]);

const quoteFlow = [
  {
    eyebrow: 'Paso 1 de 7',
    title: '¿Qué tipo de espacio quieres limpiar?',
    description: 'Esto define la base del servicio y el tipo de ambientes que vamos a considerar.',
  },
  {
    eyebrow: 'Paso 2 de 7',
    title: 'Ambientes principales',
    description: 'Cada habitación, baño, cocina o zona de trabajo suma tiempo real de limpieza.',
  },
  {
    eyebrow: 'Paso 3 de 7',
    title: 'Tamaño, estado y frecuencia',
    description: 'El mismo espacio puede cambiar mucho de precio según acumulación, rutina y alcance.',
  },
  {
    eyebrow: 'Paso 4 de 7',
    title: 'Materiales, mascotas y urgencia',
    description: 'Mascotas, productos incluidos y agenda urgente ajustan el valor de referencia.',
  },
  {
    eyebrow: 'Paso 5 de 7',
    title: 'Servicios adicionales',
    description: 'Agrega vidrios, camas, muebles, electrodomésticos, grasa marcada o detalles especiales.',
  },
  {
    eyebrow: 'Paso 6 de 7',
    title: 'Ubicación y observaciones',
    description: 'La ciudad, el sector y los detalles previos ayudan a confirmar disponibilidad y precio final.',
  },
  {
    eyebrow: 'Resultado',
    title: 'Estimado inicial de limpieza',
    description: 'Este rango sirve para orientar la conversación. El precio final se confirma con fotos y alcance exacto.',
  },
];

function buildInitialCounts() {
  const counters = [...residentialCounters, ...businessCounters];

  return counters.reduce((accumulator, counter) => {
    accumulator[counter.id] = counter.defaultValue ?? 0;
    return accumulator;
  }, {});
}

function getInitialAnswers() {
  return {
    serviceType: serviceTypes[0].value,
    size: sizeOptions[1].value,
    condition: conditionOptions[1].value,
    frequency: frequencyOptions[0].value,
    materials: materialOptions[1].value,
    pets: petOptions[0].value,
    urgency: urgencyOptions[0].value,
    city: cityOptions[0].value,
    sector: '',
    notes: '',
    counts: buildInitialCounts(),
    extras: {},
  };
}

function isBusinessService(serviceType) {
  return businessServiceTypes.includes(serviceType);
}

function getVisibleCounters(serviceType) {
  return isBusinessService(serviceType) ? businessCounters : residentialCounters;
}

function formatMoney(value) {
  return `${quoteConfig.currency}${value}`;
}

function roundTo(value, step = quoteConfig.rounding) {
  return Math.round(value / step) * step;
}

function clampNumber(value, min, max) {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) {
    return min;
  }

  return Math.min(max, Math.max(min, numericValue));
}

function getExtraMaxQuantity(extraId, answers) {
  if (singleQuantityExtras.has(extraId)) {
    return 1;
  }

  if (extraId === 'beds') {
    return Math.max(1, Number(answers.counts.bedrooms || 1));
  }

  if (extraId === 'furniture') {
    return 12;
  }

  if (extraId === 'interiorGlass' || extraId === 'exteriorGlass') {
    return 20;
  }

  return 10;
}

function getExtraUnitLabel(extraId) {
  const labels = {
    interiorGlass: 'secciones',
    exteriorGlass: 'secciones',
    glassDoors: 'unidades',
    largeMirrors: 'espejos',
    beds: 'camas',
    furniture: 'muebles',
    cabinetInterior: 'módulos',
    mattresses: 'colchones',
    smallCarpets: 'alfombras',
    ovenMicrowave: 'equipos',
    fridge: 'equipo',
    heavyGrease: 'servicio',
    highDust: 'servicio',
    lightTrash: 'servicio',
    odorDetail: 'servicio',
    delicateSurfaces: 'servicio',
    difficultAccess: 'servicio',
  };

  return labels[extraId] ?? 'unidades';
}

function calculateQuote(answers) {
  const serviceType = getServiceType(answers.serviceType);
  const size = getSizeOption(answers.size);
  const condition = getConditionOption(answers.condition);
  const frequency = getFrequencyOption(answers.frequency);
  const materials = getMaterialOption(answers.materials);
  const pets = getPetOption(answers.pets);
  const urgency = getUrgencyOption(answers.urgency);
  const city = getCityOption(answers.city);
  const counters = getVisibleCounters(answers.serviceType);

  const areaItems = counters
    .map((counter) => {
      const quantity = Number(answers.counts[counter.id] || 0);

      return {
        id: counter.id,
        label: counter.label,
        quantity,
        price: counter.price * quantity,
        minutes: counter.minutes * quantity,
      };
    })
    .filter((item) => item.quantity > 0);

  const extraItems = Object.entries(answers.extras)
    .map(([extraId, quantity]) => {
      const extra = getExtraOption(extraId);
      const numericQuantity = Number(quantity || 0);

      if (!extra || numericQuantity <= 0) {
        return null;
      }

      return {
        id: extraId,
        label: extra.label,
        quantity: numericQuantity,
        price: extra.price * numericQuantity,
        minutes: extra.minutes * numericQuantity,
      };
    })
    .filter(Boolean);

  const areaTotal = areaItems.reduce((total, item) => total + item.price, 0);
  const extraTotal = extraItems.reduce((total, item) => total + item.price, 0);
  const baseSubtotal = serviceType.basePrice + areaTotal + extraTotal + materials.price + city.travelFee;

  const multiplier = serviceType.multiplier * size.multiplier * condition.multiplier * pets.multiplier * urgency.multiplier;
  const beforeFrequency = baseSubtotal * multiplier;
  const estimated = Math.max(quoteConfig.minPrice, roundTo(beforeFrequency * frequency.multiplier));

  let highFactor = 1.16;
  if (answers.condition === 'profunda') highFactor += 0.08;
  if (answers.condition === 'intensiva') highFactor += 0.16;
  if (answers.serviceType === 'postobra') highFactor += 0.12;
  if (answers.pets !== 'ninguna') highFactor += 0.05;

  const low = Math.max(quoteConfig.minPrice, roundTo(estimated * 0.9));
  const high = Math.max(low + quoteConfig.rounding, roundTo(estimated * highFactor));

  const minutes = [...areaItems, ...extraItems].reduce((total, item) => total + item.minutes, 0);
  const adjustedMinutes = Math.max(90, Math.round(minutes * size.multiplier * condition.multiplier * pets.multiplier));
  const suggestedPeople = adjustedMinutes >= 520 ? 3 : quoteConfig.defaultTeamSize;
  const totalHours = Math.max(2, Math.ceil((adjustedMinutes / 60) * 2) / 2);
  const visitHours = Math.max(1.5, Math.ceil((totalHours / suggestedPeople) * 2) / 2);

  return {
    estimated,
    low,
    high,
    serviceType,
    size,
    condition,
    frequency,
    materials,
    pets,
    urgency,
    city,
    areaItems,
    extraItems,
    areaTotal,
    extraTotal,
    baseSubtotal,
    multiplier,
    suggestedPeople,
    totalHours,
    visitHours,
  };
}

function buildWhatsappHref(answers, quote) {
  const areaSummary = quote.areaItems.length
    ? quote.areaItems.map((item) => `${item.label}: ${item.quantity}`).join('\n')
    : 'Sin ambientes seleccionados';

  const extraSummary = quote.extraItems.length
    ? quote.extraItems.map((item) => `${item.label}: ${item.quantity}`).join('\n')
    : 'Sin extras';

  const message = [
    'Hola NIVO, quiero confirmar una cotización guiada de limpieza.',
    '',
    `Tipo de espacio: ${quote.serviceType.label}`,
    `Tamaño: ${quote.size.label}`,
    `Estado: ${quote.condition.label}`,
    `Frecuencia: ${quote.frequency.label}`,
    `Materiales: ${quote.materials.label}`,
    `Mascotas: ${quote.pets.label}`,
    `Urgencia: ${quote.urgency.label}`,
    '',
    'Ambientes:',
    areaSummary,
    '',
    'Extras:',
    extraSummary,
    '',
    `Ciudad: ${quote.city.label}`,
    `Sector / referencia: ${answers.sector || 'Por confirmar'}`,
    `Rango estimado: ${formatMoney(quote.low)} - ${formatMoney(quote.high)}`,
    `Tiempo referencial: ${quote.suggestedPeople} persona(s), aprox. ${quote.visitHours} h por visita`,
    '',
    answers.notes ? `Observaciones: ${answers.notes}` : 'Observaciones: Por confirmar con fotos.',
    '',
    'Quisiera confirmar disponibilidad, alcance exacto y precio final.',
  ].join('\n');

  return `${quoteConfig.whatsappBase}?text=${encodeURIComponent(message)}`;
}

function ChoiceCard({ checked, detail, label, name, onChange, value }) {
  return (
    <label className="quote-choice" data-active={checked ? 'true' : 'false'}>
      <input checked={checked} name={name} onChange={onChange} type="radio" value={value} />
      <span className="quote-choice__mark" aria-hidden="true" />
      <span>
        <strong>{label}</strong>
        <small>{detail}</small>
      </span>
    </label>
  );
}

function CounterCard({ counter, onChange, value }) {
  const currentValue = Number(value || 0);

  return (
    <article className="quote-counter">
      <div>
        <strong>{counter.label}</strong>
        <small>{counter.detail}</small>
      </div>

      <div className="quote-counter__control" aria-label={counter.label}>
        <button
          type="button"
          onClick={() => onChange(counter.id, currentValue - 1)}
          aria-label={`Restar ${counter.label}`}
        >
          −
        </button>
        <input
          inputMode="numeric"
          max={counter.max}
          min="0"
          onChange={(event) => onChange(counter.id, event.target.value)}
          type="number"
          value={currentValue}
        />
        <button
          type="button"
          onClick={() => onChange(counter.id, currentValue + 1)}
          aria-label={`Sumar ${counter.label}`}
        >
          +
        </button>
      </div>
    </article>
  );
}

function StepHeader({ activeStep }) {
  const current = quoteFlow[activeStep];

  return (
    <div className="quote-step-header">
      <span>{current.eyebrow}</span>
      <h1>{current.title}</h1>
      <p>{current.description}</p>
    </div>
  );
}

export default function QuoteWizard() {
  const [answers, setAnswers] = useState(getInitialAnswers);
  const [activeStep, setActiveStep] = useState(0);

  const visibleCounters = useMemo(() => getVisibleCounters(answers.serviceType), [answers.serviceType]);
  const quote = useMemo(() => calculateQuote(answers), [answers]);
  const whatsappHref = useMemo(() => buildWhatsappHref(answers, quote), [answers, quote]);
  const progress = ((activeStep + 1) / quoteFlow.length) * 100;

  function updateField(field, value) {
    setAnswers((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function updateCount(counterId, value) {
    const counter = [...residentialCounters, ...businessCounters].find((item) => item.id === counterId);
    const nextValue = clampNumber(value, 0, counter?.max ?? 99);

    setAnswers((current) => ({
      ...current,
      counts: {
        ...current.counts,
        [counterId]: nextValue,
      },
    }));
  }

  function toggleExtra(extraId) {
    setAnswers((current) => {
      const exists = Object.prototype.hasOwnProperty.call(current.extras, extraId);
      const nextExtras = { ...current.extras };

      if (exists) {
        delete nextExtras[extraId];
      } else {
        nextExtras[extraId] = 1;
      }

      return {
        ...current,
        extras: nextExtras,
      };
    });
  }

  function updateExtraQuantity(extraId, value) {
    const maxQuantity = getExtraMaxQuantity(extraId, answers);
    const nextValue = clampNumber(value, 1, maxQuantity);

    setAnswers((current) => ({
      ...current,
      extras: {
        ...current.extras,
        [extraId]: nextValue,
      },
    }));
  }

  function goNext() {
    setActiveStep((current) => Math.min(current + 1, quoteFlow.length - 1));
  }

  function goBack() {
    setActiveStep((current) => Math.max(current - 1, 0));
  }

  function renderChoiceGrid(name, options, columns = 'auto') {
    return (
      <div className="quote-choice-grid" data-columns={columns}>
        {options.map((option) => (
          <ChoiceCard
            checked={answers[name] === option.value}
            detail={option.detail}
            key={option.value}
            label={option.label}
            name={name}
            onChange={() => updateField(name, option.value)}
            value={option.value}
          />
        ))}
      </div>
    );
  }

  function renderStep() {
    if (activeStep === 0) {
      return renderChoiceGrid('serviceType', serviceTypes);
    }

    if (activeStep === 1) {
      return (
        <div className="quote-counter-grid">
          {visibleCounters.map((counter) => (
            <CounterCard
              counter={counter}
              key={counter.id}
              onChange={updateCount}
              value={answers.counts[counter.id]}
            />
          ))}
        </div>
      );
    }

    if (activeStep === 2) {
      return (
        <div className="quote-stacked-groups">
          <section>
            <h2>Tamaño aproximado</h2>
            {renderChoiceGrid('size', sizeOptions, 'four')}
          </section>

          <section>
            <h2>Estado actual</h2>
            {renderChoiceGrid('condition', conditionOptions, 'four')}
          </section>

          <section>
            <h2>Frecuencia</h2>
            {renderChoiceGrid('frequency', frequencyOptions, 'four')}
          </section>
        </div>
      );
    }

    if (activeStep === 3) {
      return (
        <div className="quote-stacked-groups">
          <section>
            <h2>Materiales</h2>
            {renderChoiceGrid('materials', materialOptions, 'four')}
          </section>

          <section>
            <h2>Mascotas</h2>
            {renderChoiceGrid('pets', petOptions)}
          </section>

          <section>
            <h2>Urgencia</h2>
            {renderChoiceGrid('urgency', urgencyOptions, 'three')}
          </section>
        </div>
      );
    }

    if (activeStep === 4) {
      return (
        <div className="quote-extra-grid">
          {extraOptions.map((extra) => {
            const selected = Object.prototype.hasOwnProperty.call(answers.extras, extra.id);
            const quantity = answers.extras[extra.id] ?? 1;
            const maxQuantity = getExtraMaxQuantity(extra.id, answers);

            return (
              <article className="quote-extra" data-active={selected ? 'true' : 'false'} key={extra.id}>
                <label>
                  <input checked={selected} onChange={() => toggleExtra(extra.id)} type="checkbox" />
                  <span>
                    <strong>{extra.label}</strong>
                    <small>{extra.detail}</small>
                  </span>
                </label>

                {selected && maxQuantity > 1 ? (
                  <div className="quote-extra__quantity">
                    <span>{getExtraUnitLabel(extra.id)}</span>
                    <div className="quote-counter__control">
                      <button
                        type="button"
                        onClick={() => updateExtraQuantity(extra.id, Number(quantity) - 1)}
                        aria-label={`Restar ${extra.label}`}
                      >
                        −
                      </button>
                      <input
                        inputMode="numeric"
                        max={maxQuantity}
                        min="1"
                        onChange={(event) => updateExtraQuantity(extra.id, event.target.value)}
                        type="number"
                        value={quantity}
                      />
                      <button
                        type="button"
                        onClick={() => updateExtraQuantity(extra.id, Number(quantity) + 1)}
                        aria-label={`Sumar ${extra.label}`}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      );
    }

    if (activeStep === 5) {
      return (
        <div className="quote-location-grid">
          <section>
            <h2>Ciudad</h2>
            {renderChoiceGrid('city', cityOptions)}
          </section>

          <label className="quote-field">
            <span>Sector o referencia</span>
            <input
              onChange={(event) => updateField('sector', event.target.value)}
              placeholder="Ej. Centro de Ibarra, Los Ceibos, cerca del parque..."
              type="text"
              value={answers.sector}
            />
          </label>

          <label className="quote-field quote-field--wide">
            <span>Observaciones opcionales</span>
            <textarea
              onChange={(event) => updateField('notes', event.target.value)}
              placeholder="Ej. Hay área de máquinas, grasa en cocina, gatos, vidrios altos, polvo acumulado, acceso difícil, muebles delicados..."
              value={answers.notes}
            />
          </label>
        </div>
      );
    }

    return (
      <div className="quote-final">
        <div className="quote-final__price">
          <span>Rango referencial</span>
          <strong>
            {formatMoney(quote.low)} - {formatMoney(quote.high)}
          </strong>
          <p>
            La visita se estima con {quote.suggestedPeople} persona(s), aproximadamente {quote.visitHours} h por visita.
          </p>
        </div>

        <div className="quote-final__grid">
          <article>
            <span>Servicio</span>
            <strong>{quote.serviceType.label}</strong>
          </article>
          <article>
            <span>Estado</span>
            <strong>{quote.condition.label}</strong>
          </article>
          <article>
            <span>Frecuencia</span>
            <strong>{quote.frequency.label}</strong>
          </article>
          <article>
            <span>Ciudad</span>
            <strong>{quote.city.label}</strong>
          </article>
        </div>

        <div className="quote-breakdown">
          <h2>Resumen usado para calcular</h2>
          <div>
            {quote.areaItems.map((item) => (
              <span key={item.id}>{item.label}: {item.quantity}</span>
            ))}
            {quote.extraItems.map((item) => (
              <span key={item.id}>{item.label}: {item.quantity}</span>
            ))}
          </div>
        </div>

        <a className="quote-result__button" href={whatsappHref} target="_blank" rel="noreferrer">
          Enviar resumen por WhatsApp
        </a>
      </div>
    );
  }

  return (
    <div className="quote-page-wizard">
      <div className="quote-progress" aria-hidden="true">
        <span style={{ width: `${progress}%` }} />
      </div>

      <div className="quote-wizard-panel">
        <div className="quote-main-panel">
          <StepHeader activeStep={activeStep} />
          {renderStep()}

          <div className="quote-navigation">
            <button className="quote-nav-button quote-nav-button--ghost" disabled={activeStep === 0} onClick={goBack} type="button">
              Anterior
            </button>

            {activeStep < quoteFlow.length - 1 ? (
              <button className="quote-nav-button" onClick={goNext} type="button">
                Continuar
              </button>
            ) : (
              <a className="quote-nav-button" href={whatsappHref} target="_blank" rel="noreferrer">
                Confirmar por WhatsApp
              </a>
            )}
          </div>
        </div>

        <aside className="quote-live-summary" aria-live="polite">
          <span className="quote-live-summary__label">Estimado en vivo</span>
          <strong>{formatMoney(quote.low)} - {formatMoney(quote.high)}</strong>
          <p>
            Referencia inicial. El precio final depende de fotos, acceso, estado real y alcance exacto.
          </p>

          <div className="quote-live-summary__chips">
            <span>{quote.serviceType.shortLabel}</span>
            <span>{quote.condition.label}</span>
            <span>{quote.frequency.label}</span>
            <span>{quote.city.label}</span>
          </div>

          <dl>
            <div>
              <dt>Equipo sugerido</dt>
              <dd>{quote.suggestedPeople} persona(s)</dd>
            </div>
            <div>
              <dt>Tiempo aprox.</dt>
              <dd>{quote.visitHours} h / visita</dd>
            </div>
            <div>
              <dt>Extras</dt>
              <dd>{quote.extraItems.length}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
