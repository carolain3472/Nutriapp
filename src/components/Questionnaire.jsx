import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Questionnaire.css';

const Questionnaire = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        objetivo: '',
        requerimientosSalud: '',
        peso: '',
        estatura: '',
        edad: '',
        tipoDieta: '',
        alergias: '',
        intolerancias: '',
        comidasPorDia: '',
        grupoAlimentosPreferido: [],
        alimentosFavoritos: '',
        platillosFavoritos: ''
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                grupoAlimentosPreferido: checked
                    ? [...prev.grupoAlimentosPreferido, value]
                    : prev.grupoAlimentosPreferido.filter(item => item !== value)
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const nextStep = () => setStep(prev => prev + 1);
    const prevStep = () => setStep(prev => prev - 1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const token = localStorage.getItem('token');
        if (!token) {
            alert('No estás autenticado. Por favor, inicia sesión de nuevo.');
            navigate('/login');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/preferences', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const result = await response.json();
                // Actualizar el usuario en localStorage con las nuevas preferencias
                const user = JSON.parse(localStorage.getItem('user'));
                user.preferences = result.user.preferences;
                user.hasCompletedQuestionnaire = result.user.hasCompletedQuestionnaire;
                localStorage.setItem('user', JSON.stringify(user));
                
                alert('¡Gracias por completar el cuestionario! Tu experiencia ahora será personalizada.');
                navigate('/dashboard');
            } else {
                const error = await response.json();
                alert(`Error al guardar tus preferencias: ${error.message}`);
            }
        } catch (error) {
            console.error('Error de red:', error);
            alert('No se pudo conectar con el servidor. Inténtalo más tarde.');
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2>Paso 1: Tu Objetivo</h2>
                        <label>¿Cuál es tu objetivo principal?</label>
                        <select name="objetivo" value={formData.objetivo} onChange={handleChange} required>
                            <option value="">Selecciona uno</option>
                            <option value="bajar">Bajar de peso</option>
                            <option value="subir">Subir de peso</option>
                            <option value="mantener">Mantener peso</option>
                        </select>
                        <label>¿Tienes algún requerimiento de salud específico? (Ej: diabetes, hipertensión)</label>
                        <input type="text" name="requerimientosSalud" value={formData.requerimientosSalud} onChange={handleChange} />
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2>Paso 2: Sobre Ti</h2>
                        <label>Peso (kg)</label>
                        <input type="number" name="peso" value={formData.peso} onChange={handleChange} required />
                        <label>Estatura (cm)</label>
                        <input type="number" name="estatura" value={formData.estatura} onChange={handleChange} required />
                        <label>Edad</label>
                        <input type="number" name="edad" value={formData.edad} onChange={handleChange} required />
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2>Paso 3: Tipo de Dieta y Restricciones</h2>
                        <label>¿Qué tipo de dieta prefieres?</label>
                        <select name="tipoDieta" value={formData.tipoDieta} onChange={handleChange}>
                            <option value="">Selecciona una</option>
                            <option value="omnivora">Omnívora</option>
                            <option value="vegetariana">Vegetariana</option>
                            <option value="vegana">Vegana</option>
                            <option value="pescetariana">Pescetariana</option>
                            <option value="otra">Otra</option>
                        </select>
                        <label>¿Tienes alguna alergia alimentaria?</label>
                        <input type="text" name="alergias" value={formData.alergias} onChange={handleChange} />
                        <label>¿Tienes alguna intolerancia alimentaria?</label>
                        <input type="text" name="intolerancias" value={formData.intolerancias} onChange={handleChange} />
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h2>Paso 4: Hábitos y Preferencias</h2>
                        <label>¿Cuántas comidas consumes al día?</label>
                        <select name="comidasPorDia" value={formData.comidasPorDia} onChange={handleChange}>
                            <option value="">Selecciona una</option>
                            <option value="3">3 comidas</option>
                            <option value="4">4 comidas</option>
                            <option value="5">5 comidas</option>
                            <option value="otro">Otro</option>
                        </select>
                        <label>Grupos de alimentos preferidos:</label>
                        <div>
                            <label><input type="checkbox" name="grupoAlimentosPreferido" value="frutas" onChange={handleChange} /> Frutas</label>
                            <label><input type="checkbox" name="grupoAlimentosPreferido" value="verduras" onChange={handleChange} /> Verduras</label>
                            <label><input type="checkbox" name="grupoAlimentosPreferido" value="proteinas" onChange={handleChange} /> Proteínas</label>
                            <label><input type="checkbox" name="grupoAlimentosPreferido" value="carbohidratos" onChange={handleChange} /> Carbohidratos</label>
                            <label><input type="checkbox" name="grupoAlimentosPreferido" value="grasas" onChange={handleChange} /> Grasas saludables</label>
                        </div>
                    </div>
                );
            case 5:
                return (
                    <div>
                        <h2>Paso 5: Tus Favoritos</h2>
                        <label>Alimentos favoritos:</label>
                        <textarea name="alimentosFavoritos" value={formData.alimentosFavoritos} onChange={handleChange}></textarea>
                        <label>Platillos favoritos:</label>
                        <textarea name="platillosFavoritos" value={formData.platillosFavoritos} onChange={handleChange}></textarea>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="questionnaire-container">
            <form onSubmit={handleSubmit} className="questionnaire-form">
                {renderStep()}
                <div className="navigation-buttons">
                    {step > 1 && <button type="button" onClick={prevStep}>Anterior</button>}
                    {step < 5 && <button type="button" onClick={nextStep}>Siguiente</button>}
                    {step === 5 && <button type="submit">Guardar y finalizar</button>}
                </div>
                <div className="progress-bar">
                    <div className="progress" style={{ width: `${(step / 5) * 100}%` }}></div>
                </div>
            </form>
        </div>
    );
};

export default Questionnaire; 