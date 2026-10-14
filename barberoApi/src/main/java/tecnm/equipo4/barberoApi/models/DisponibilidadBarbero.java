package tecnm.equipo4.barberoApi.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.text.DateFormat;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data

@Table (name = "disponibilidadB")
public class DisponibilidadBarbero {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDisponibilidad;

    @NotNull
    @Column(name = "dia")
    @FutureOrPresent
    private DateFormat dia;

    @NotNull
    @Column(name = "diaEntrada")
    @FutureOrPresent
    private DateFormat diaEntrada;

    @NotNull
    @Column(name = "diaSalida")
    @Future
    private DateFormat diaSalida;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "idUsuario")
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private Barbero barbero;
}
