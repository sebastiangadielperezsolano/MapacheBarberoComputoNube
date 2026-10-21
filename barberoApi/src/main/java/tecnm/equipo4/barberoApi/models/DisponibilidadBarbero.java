package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.FutureOrPresent;
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
@Table(name = "disponibilidadB")
public class DisponibilidadBarbero {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDisponibilidad;

    @NotNull
    @Column(name = "dia")
    @FutureOrPresent
    private LocalDate dia;

    @NotNull
    @Column(name = "diaEntrada")
    private LocalTime diaEntrada;

    @NotNull
    @Column(name = "diaSalida")
    private LocalTime diaSalida;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "idUsuario")
    @JsonIgnoreProperties({"disponibilidades", "turnos", "password"})
    private Barbero barbero;
}