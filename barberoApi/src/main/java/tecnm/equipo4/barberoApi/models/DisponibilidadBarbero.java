package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Table(name = "disponibilidad_barbero")
public class DisponibilidadBarbero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_disponibilidad")
    private Long idDisponibilidad;

    @NotNull
    @Column(name = "dia")
    private LocalDate dia;

    @NotNull
    @Column(name = "dia_entrada")
    private LocalTime diaEntrada;

    @NotNull
    @Column(name = "dia_salida")
    private LocalTime diaSalida;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "id_barbero", referencedColumnName = "id_usuario")
    @JsonIgnoreProperties({"disponibilidades", "turnos", "password"})
    private Barbero barbero;
}