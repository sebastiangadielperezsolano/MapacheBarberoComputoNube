package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
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

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "idUsuario")
    private Barbero barbero;
}