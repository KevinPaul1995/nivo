import { useMemo, useState } from 'react';
import {
  businessCounters,
  businessServiceTypes,
  cityOptions,
  conditionOptions,
  delicateSurfaceOptions,
  extraOptions,
  frequencyOptions,
  getCityOption,
  getConditionOption,
  getDelicateSurfaceOption,
  getExtraOption,
  getFrequencyOption,
  getMaterialOption,
  getServiceType,
  getSizeOption,
  getUrgencyOption,
  materialOptions,
  moveOutCounters,
  petCounters,
  postConstructionCounters,
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
    description: 'Selecciona las áreas que realmente se van a limpiar en esta visita.',
  },
  {
    eyebrow: 'Paso 3 de 7',
    title: 'Tamaño, estado y frecuencia',
    description: 'La última limpieza y la rutina ayudan a estimar el esfuerzo correcto.',
  },
  {
    eyebrow: 'Paso 4 de 7',
    title: 'Materiales, mascotas y urgencia',
    description: 'Indica materiales, perros, gatos y disponibilidad de agenda.',
  },
  {
    eyebrow: 'Paso 5 de 7',
    title: 'Servicios adicionales',
    description: 'Agrega solo los detalles que necesitas incluir en la visita.',
  },
  {
    eyebrow: 'Paso 6 de 7',
    title: 'Ubicación y observaciones',
    description: 'La ciudad y el sector ayudan a calcular movilización y coordinar llegada.',
  },
  {
    eyebrow: 'Resultado',
    title: 'Valor calculado de limpieza',
    description: 'Este valor se calcula con los ambientes, extras, tiempo operativo y condiciones que seleccionaste.',
  },
];

function buildInitialCounts() {
  const counters = [
    ...residentialCounters,
    ...moveOutCounters,
    ...postConstructionCounters,
    ...businessCounters,
    ...petCounters,
  ];

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
    urgency: urgencyOptions[0].value,
    city: cityOptions[0].value,
    delicateSurface: delicateSurfaceOptions[0].value,
    delicateSurfaceOther: '',
    sector: '',
    notes: '',
    counts: buildInitialCounts(),
    extras: {},
  };
}

function isBusinessService(serviceType) {
  return businessServiceTypes.includes(serviceType);
}

function isMoveOutService(serviceType) {
  return serviceType === 'mudanza';
}

function isPostConstructionService(serviceType) {
  return serviceType === 'postobra';
}

function shouldShowPets(serviceType) {
  return serviceType === 'casa' || serviceType === 'departamento';
}

function getVisibleCounters(serviceType) {
  if (isMoveOutService(serviceType)) {
    return moveOutCounters;
  }

  if (isPostConstructionService(serviceType)) {
    return postConstructionCounters;
  }

  return isBusinessService(serviceType) ? businessCounters : residentialCounters;
}

function getVisibleExtras(serviceType) {
  return extraOptions.filter((extra) => !extra.services || extra.services.includes(serviceType));
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
  const extra = getExtraOption(extraId);

  if (extra?.pricingMode === 'roomBased') {
    return 1;
  }

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

function getRoomBasedUnits(extra, context) {
  if (extra.roomSource === 'bedroomKitchen') {
    if (isPostConstructionService(context.answers.serviceType)) {
      return Math.max(1, Number(context.answers.counts.postWindows || 0));
    }

    if (isMoveOutService(context.answers.serviceType)) {
      return Math.max(
        1,
        Number(context.answers.counts.emptyBedrooms || 0) + Number(context.answers.counts.emptyKitchens || 0),
      );
    }

    if (isBusinessService(context.answers.serviceType)) {
      return Math.max(
        1,
        Number(context.answers.counts.meetingRooms || 0) +
          Number(context.answers.counts.receptions || 0) +
          Number(context.answers.counts.kitchenettes || 0),
      );
    }

    return Math.max(
      1,
      Number(context.answers.counts.bedrooms || 0) + Number(context.answers.counts.kitchens || 0),
    );
  }

  return 1;
}

function calculateExtraMetrics(extra, quantity, context) {
  if (extra.pricingMode === 'roomBased') {
    const billableUnits = getRoomBasedUnits(extra, context);

    return {
      quantity: billableUnits,
      price: roundTo(billableUnits * extra.roomRate, 1),
      minutes: extra.minutes * billableUnits,
      appliesMultipliers: extra.appliesMultipliers !== false,
    };
  }

  const surface = extra.requiresDetail === 'delicateSurface'
    ? getDelicateSurfaceOption(context.answers.delicateSurface)
    : null;
  const surfaceMultiplier = surface?.multiplier ?? 1;

  return {
    quantity,
    price: roundTo(extra.price * quantity * surfaceMultiplier, 0.5),
    minutes: Math.round(extra.minutes * quantity * surfaceMultiplier),
    appliesMultipliers: extra.appliesMultipliers !== false,
    detailLabel: surface
      ? surface.value === 'otros' && context.answers.delicateSurfaceOther
        ? `${surface.label}: ${context.answers.delicateSurfaceOther}`
        : surface.label
      : null,
  };
}

function getPetItems(answers) {
  if (!shouldShowPets(answers.serviceType)) {
    return [];
  }

  return petCounters
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
}

function getPetSummary(petItems) {
  if (!petItems.length) {
    return 'Sin mascotas';
  }

  return petItems.map((item) => `${item.label}: ${item.quantity}`).join(', ');
}

function calculateQuote(answers) {
  const serviceType = getServiceType(answers.serviceType);
  const size = getSizeOption(answers.size);
  const condition = getConditionOption(answers.condition);
  const frequency = getFrequencyOption(answers.frequency);
  const materials = getMaterialOption(answers.materials);
  const urgency = getUrgencyOption(answers.urgency);
  const city = getCityOption(answers.city);
  const counters = getVisibleCounters(answers.serviceType);
  const visibleExtraIds = new Set(getVisibleExtras(answers.serviceType).map((extra) => extra.id));

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

  const areaTotal = areaItems.reduce((total, item) => total + item.price, 0);

  const extraItems = Object.entries(answers.extras)
    .map(([extraId, quantity]) => {
      const extra = getExtraOption(extraId);
      const numericQuantity = Number(quantity || 0);

      if (!extra || !visibleExtraIds.has(extraId) || numericQuantity <= 0) {
        return null;
      }

      const metrics = calculateExtraMetrics(extra, numericQuantity, {
        answers,
      });

      return {
        id: extraId,
        label: extra.label,
        summaryLabel: metrics.detailLabel ? `${extra.label} (${metrics.detailLabel})` : extra.label,
        quantity: metrics.quantity,
        price: metrics.price,
        minutes: metrics.minutes,
        appliesMultipliers: metrics.appliesMultipliers,
      };
    })
    .filter(Boolean);

  const petItems = getPetItems(answers);
  const petTotal = petItems.reduce((total, item) => total + item.price, 0);
  const petMinutes = petItems.reduce((total, item) => total + item.minutes, 0);
  const variableExtraTotal = extraItems
    .filter((item) => item.appliesMultipliers)
    .reduce((total, item) => total + item.price, 0);
  const fixedExtraTotal = extraItems
    .filter((item) => !item.appliesMultipliers)
    .reduce((total, item) => total + item.price, 0);
  const extraTotal = variableExtraTotal + fixedExtraTotal;
  const laborSubtotal = serviceType.basePrice + areaTotal + variableExtraTotal + petTotal;
  const fixedCharges = fixedExtraTotal + materials.price + city.travelFee;
  const effortMultiplier = serviceType.multiplier * size.multiplier * condition.multiplier;
  const priceMultiplier = frequency.multiplier * urgency.multiplier;
  const baseSubtotal = laborSubtotal + fixedCharges;

  const minutes = [...areaItems, ...extraItems].reduce((total, item) => total + item.minutes, petMinutes);
  const measuredMinutes = Math.max(90, Math.round(minutes * effortMultiplier));
  const adjustedMinutes = measuredMinutes;
  const estimated = Math.max(
    quoteConfig.minPrice,
    roundTo((laborSubtotal * effortMultiplier * priceMultiplier) + fixedCharges),
  );
  const low = estimated;
  const high = estimated;

  let suggestedPeople = quoteConfig.defaultTeamSize;
  if (adjustedMinutes >= 480) suggestedPeople = 3;
  if (adjustedMinutes >= 840) suggestedPeople = 4;

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
    petItems,
    petSummary: getPetSummary(petItems),
    urgency,
    city,
    areaItems,
    extraItems,
    areaTotal,
    extraTotal,
    baseSubtotal,
    laborSubtotal,
    variableExtraTotal,
    fixedExtraTotal,
    fixedCharges,
    effortMultiplier,
    priceMultiplier,
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
    ? quote.extraItems.map((item) => `${item.summaryLabel ?? item.label}: ${item.quantity}`).join('\n')
    : 'Sin extras';

  const message = [
    'Hola NIVO, quiero confirmar una cotización guiada de limpieza.',
    '',
    `Tipo de espacio: ${quote.serviceType.label}`,
    `Tamaño: ${quote.size.label}`,
    `Estado: ${quote.condition.label}`,
    `Frecuencia: ${quote.frequency.label}`,
    `Materiales: ${quote.materials.label}`,
    `Mascotas: ${quote.petSummary}`,
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
    `Valor calculado: ${formatMoney(quote.estimated)}`,
    `Tiempo estimado: ${quote.suggestedPeople} persona(s), aprox. ${quote.visitHours} h por visita`,
    '',
    answers.notes ? `Observaciones: ${answers.notes}` : 'Observaciones: Por confirmar con fotos.',
    '',
    'Quisiera coordinar la visita con este valor calculado.',
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
        {detail ? <small>{detail}</small> : null}
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
    const counter = [
      ...residentialCounters,
      ...moveOutCounters,
      ...postConstructionCounters,
      ...businessCounters,
      ...petCounters,
    ].find((item) => item.id === counterId);
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
      const showPets = shouldShowPets(answers.serviceType);

      return (
        <div className="quote-stacked-groups">
          <section>
            <h2>Materiales</h2>
            {renderChoiceGrid('materials', materialOptions, 'three')}
          </section>

          {showPets ? (
            <section>
              <h2>Mascotas</h2>
              <div className="quote-counter-grid">
                {petCounters.map((counter) => (
                  <CounterCard
                    counter={counter}
                    key={counter.id}
                    onChange={updateCount}
                    value={answers.counts[counter.id]}
                  />
                ))}
              </div>
            </section>
          ) : null}

          <section>
            <h2>Urgencia</h2>
            {renderChoiceGrid('urgency', urgencyOptions, 'three')}
          </section>
        </div>
      );
    }

    if (activeStep === 4) {
      const visibleExtras = getVisibleExtras(answers.serviceType);

      return (
        <div className="quote-extra-grid">
          {visibleExtras.map((extra) => {
            const selected = Object.prototype.hasOwnProperty.call(answers.extras, extra.id);
            const quantity = answers.extras[extra.id] ?? 1;
            const maxQuantity = getExtraMaxQuantity(extra.id, answers);

            return (
              <article className="quote-extra" data-active={selected ? 'true' : 'false'} key={extra.id}>
                <label>
                  <input checked={selected} onChange={() => toggleExtra(extra.id)} type="checkbox" />
                  <span>
                    <strong>{extra.label}</strong>
                    {extra.detail ? <small>{extra.detail}</small> : null}
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

                {selected && extra.requiresDetail === 'delicateSurface' ? (
                  <div className="quote-extra__detail">
                    <label className="quote-field quote-field--compact">
                      <span>Tipo de superficie</span>
                      <select
                        onChange={(event) => updateField('delicateSurface', event.target.value)}
                        value={answers.delicateSurface}
                      >
                        {delicateSurfaceOptions.map((surface) => (
                          <option key={surface.value} value={surface.value}>
                            {surface.label}
                          </option>
                        ))}
                      </select>
                    </label>

                    {answers.delicateSurface === 'otros' ? (
                      <label className="quote-field quote-field--compact">
                        <span>Indica el material</span>
                        <input
                          onChange={(event) => updateField('delicateSurfaceOther', event.target.value)}
                          placeholder="Ej. porcelanato, granito, cuero, pieza decorativa..."
                          type="text"
                          value={answers.delicateSurfaceOther}
                        />
                      </label>
                    ) : null}
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
          <span>Valor calculado</span>
          <strong>{formatMoney(quote.estimated)}</strong>
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
              <span key={item.id}>{item.summaryLabel ?? item.label}: {item.quantity}</span>
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
          <span className="quote-live-summary__label">Valor en vivo</span>
          <strong>{formatMoney(quote.estimated)}</strong>
          <p>Se actualiza segun ambientes, extras, tiempo estimado, materiales y ciudad.</p>

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
